import {useMutation} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {useState} from "react";
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

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

interface AddProductImageProps {
  id: string;
}

const AddProductImage = ({id}: AddProductImageProps) => {
  const [image, setImage] = useState<any>();
  const [loading, setLoading] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addProductImage = useMutation(api.products.addProductImage);

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

  const handleAddProductImage = async () => {
    if (!image)
      return ToastAndroid.showWithGravityAndOffset(
        "Select an image first!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

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

      await addProductImage({
        productId: id as Id<"products">,
        newImageId: storageId,
      });

      setImage(null);

      ToastAndroid.showWithGravityAndOffset(
        "Product image added successfully",
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
      <View>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Add Product Image
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
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleAddProductImage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Add Product Image
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductImage;
