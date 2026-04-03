import {useClerk, useUser} from "@clerk/clerk-expo";
import {useCallback, useState, useEffect} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

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
                50,
              );
            },
            style: "destructive",
          },
        ],
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } finally {
      setLoading(false);
    }
  }, [isLoaded, user, signOut, resetOnboarding]);

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, {duration: 400});
  }, [opacity, scale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  return (
    <View className="flex-1 justify-center items-center px-5">
      <Animated.View
        style={containerStyle}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full items-center shadow-lg"
      >
        <View className="bg-red-100 dark:bg-red-900 rounded-full h-24 w-24 items-center justify-center mb-4">
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            className="w-16 h-16"
          />
        </View>
        <Text className="text-2xl font-bold mb-2 text-red-500">
          Delete Account
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-300 text-center leading-6 mb-6">
          This action is permanent and cannot be undone. All your data will be
          permanently removed. Please confirm before proceeding.
        </Text>
        <Animated.View style={btnStyle} className="w-full">
          <TouchableOpacity
            onPressIn={() => (btnScale.value = withSpring(0.95))}
            onPressOut={() => (btnScale.value = withSpring(1))}
            onPress={handleDeleteUser}
            disabled={loading}
            className={`w-full py-3 rounded-xl items-center ${
              loading ? "bg-red-300" : "bg-red-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Delete Account
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default DeleteUser;
