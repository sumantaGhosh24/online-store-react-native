import {Ionicons} from "@expo/vector-icons";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {router, Stack} from "expo-router";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {z} from "zod";

import {Colors} from "@/constant/colors";
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
  const [loading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createCategory = useMutation(api.categories.createCategory);

  const selectImage = async (source: "camera" | "library") => {
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
  };

  const onSubmit = async (data: CreateCategoryForm) => {
    if (!image) return;

    try {
      setLoading(true);

      const url = await generateUploadUrl();

      const response = await fetch(image.uri);
      const blob = await response.blob();

      const result = await fetch(url, {
        method: "POST",
        headers: image.type ? {"Content-Type": `${image.mimeType}`} : {},
        body: blob,
      });
      const {storageId} = await result.json();

      await createCategory({
        name: data.name,
        image: storageId,
      });

      reset();
      setImage(null);

      ToastAndroid.showWithGravityAndOffset(
        "Category created successfully",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="px-3 mt-5"
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          headerLeft: () => (
            <TouchableOpacity
              className="items-center justify-center mr-5"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Create Category
        </Text>
        {image && (
          <View>
            <Image
              source={{uri: image?.uri}}
              className="h-[250px] w-full rounded mb-4"
            />
          </View>
        )}
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("library")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">Open Media</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("camera")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">
                Open Camera
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Controller
          control={control}
          name="name"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter category name"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 mb-2">{errors.name.message}</Text>
        )}
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Create Category
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateCategory;
