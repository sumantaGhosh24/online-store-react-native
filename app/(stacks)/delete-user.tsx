import {useClerk, useUser} from "@clerk/clerk-expo";
import {useCallback, useState} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import {useAuthStore} from "@/store";

const DeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const {isLoaded, user} = useUser();

  const {signOut} = useClerk();

  const {resetOnboarding} = useAuthStore();

  const handleDeleteUser = useCallback(async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      Alert.alert(
        "Delete User",
        "Are you sure you want to delete your account?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await user?.delete();

              await signOut();

              resetOnboarding();

              ToastAndroid.showWithGravityAndOffset(
                "User deleted successfully",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            },
            style: "destructive",
          },
        ]
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user, signOut, resetOnboarding]);

  return (
    <View className="flex-1 items-center justify-center px-2">
      <View className="dark:bg-white rounded-full h-24 w-24 items-center justify-center">
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          className="w-24 h-24 mb-4"
        />
      </View>
      <Text className="text-2xl font-bold mb-2 dark:text-white">
        Delete User
      </Text>
      <Text className="text-lg mb-2 dark:text-white text-center">
        This action is irreversible. Are you sure you want to delete your
        account? This action cannot be undone. Please be careful.
      </Text>
      <TouchableOpacity
        className="bg-red-500 rounded-full p-3 items-center mb-4 disabled:bg-blue-300"
        onPress={handleDeleteUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-medium text-white">Delete User</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DeleteUser;
