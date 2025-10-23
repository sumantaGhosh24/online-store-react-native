import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {useLocalSearchParams} from "expo-router";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const updateCategorySchema = z.object({
  name: z.string().min(2).max(50),
});
type UpdateCategoryForm = z.infer<typeof updateCategorySchema>;

const UpdateCategory = () => {
  const {id} = useLocalSearchParams();

  const category = useQuery(api.categories.getCategory, {
    id: id as Id<"categories">,
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateCategoryForm>({
    resolver: zodResolver(updateCategorySchema),
    values: {
      name: category?.name || "",
    },
  });

  const [image, setImage] = useState<any>();
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateCategory = useMutation(api.categories.updateCategory);

  const selectImage = useCallback(async (source: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      mediaTypes: ["images"],
    };

    let result;

    if (source === "camera") {
      const {granted} = await ImagePicker.requestCameraPermissionsAsync();

      if (!granted) {
        ToastAndroid.showWithGravityAndOffset(
          "Permission denied",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        ToastAndroid.showWithGravityAndOffset(
          "Permission denied",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setImage(result.assets[0] as any);
    }
  }, []);

  const onSubmit = useCallback(
    async (data: UpdateCategoryForm) => {
      setLoading("loading");

      try {
        if (image) {
          const url = await generateUploadUrl();

          const response = await fetch(image.uri);
          const blob = await response.blob();

          const result = await fetch(url, {
            method: "POST",
            headers: image.type ? {"Content-Type": `${image.mimeType}`} : {},
            body: blob,
          });
          const {storageId} = await result.json();

          await updateCategory({
            id: id as Id<"categories">,
            name: data.name,
            image: storageId,
          });
        } else {
          await updateCategory({
            id: id as Id<"categories">,
            name: data.name,
          });
        }
        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Category updated successfully",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      }
    },
    [generateUploadUrl, id, image, updateCategory]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="px-3 mt-5"
    >
      <View>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Update Category
        </Text>
        <View>
          <Image
            source={{uri: image ? image?.uri : category?.image}}
            className="h-[250px] w-full rounded mb-4"
          />
        </View>
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("library")}
            disabled={loading === "loading"}
          >
            {loading === "loading" ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">Open Media</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("camera")}
            disabled={loading === "loading"}
          >
            {loading === "loading" ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">
                Open Camera
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <AnimatedInput
          control={control}
          name="name"
          label="Category Name"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.name?.message}
          setLoading={setLoading}
        />
        <AnimatedButton
          title="Update Category"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateCategory;
