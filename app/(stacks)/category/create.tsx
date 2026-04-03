import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "convex/react";
import * as ImagePicker from "expo-image-picker";
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
import Animated, {FadeInDown} from "react-native-reanimated";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
});
type CreateCategoryForm = z.infer<typeof createCategorySchema>;

const CreateCategory = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const [image, setImage] = useState<any>();
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createCategory = useMutation(api.categories.createCategory);

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
          50,
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
          50,
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
    async (data: CreateCategoryForm) => {
      if (!image) {
        ToastAndroid.showWithGravityAndOffset(
          "Please select an image first",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
        return;
      }

      setLoading("loading");

      try {
        const url = await generateUploadUrl();

        const response = await fetch(image.uri);
        if (!response.ok) throw new Error("Failed to fetch image data.");

        const blob = await response.blob();

        const result = await fetch(url, {
          method: "POST",
          headers: image.mimeType ? {"Content-Type": image.mimeType} : {},
          body: blob,
        });

        if (!result.ok) throw new Error("Image upload failed.");

        const {storageId} = await result.json();

        await createCategory({
          name: data.name,
          image: storageId,
        });

        setLoading("success");

        reset();
        setImage(null);

        ToastAndroid.showWithGravityAndOffset(
          "Category created successfully",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
      }
    },
    [image, generateUploadUrl, createCategory, reset],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <View className="px-6">
        <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
          {image && (
            <View className="mb-4">
              <Image
                source={{uri: image?.uri}}
                className="h-[250px] w-full rounded"
                resizeMode="cover"
              />
            </View>
          )}
          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity
              className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
              onPress={() => selectImage("library")}
              disabled={loading === "loading"}
            >
              {loading === "loading" ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-medium text-white">
                  Open Media
                </Text>
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
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)} className="mt-6">
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
            title="Create Category"
            state={loading}
            onPress={handleSubmit(onSubmit)}
          />
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateCategory;
