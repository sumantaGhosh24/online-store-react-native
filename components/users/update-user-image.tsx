import {useUser} from "@clerk/clerk-expo";
import {useMutation} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {useCallback, useState} from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import {api} from "@/convex/_generated/api";

const UpdateUserImage = () => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  const {user} = useUser();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateUserImage = useMutation(api.users.updateUserImage);

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

  const uploadImageToClerk = useCallback(
    async (image: any) => {
      if (!user || !image) return;

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

        await updateUserImage({storageId});

        ToastAndroid.showWithGravityAndOffset(
          "User image updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } catch (error: any) {
        ToastAndroid.showWithGravityAndOffset(
          error.message || "Failed to update profile image",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } finally {
        setLoading(false);
      }
    },
    [generateUploadUrl, updateUserImage, user]
  );

  return (
    <View>
      <Text className="text-2xl font-bold mb-2 dark:text-white">
        Update User Image
      </Text>
      {/* @ts-ignore */}
      {image && image.uri && (
        <View>
          <Image
            // @ts-ignore
            source={{uri: image?.uri}}
            className="h-[250px] w-full rounded mb-4"
          />
        </View>
      )}
      <TouchableOpacity
        className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
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
        className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
        onPress={() => selectImage("camera")}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-medium text-white">Open Camera</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
        onPress={() => uploadImageToClerk(image as any)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-medium text-white">Update Image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UpdateUserImage;
