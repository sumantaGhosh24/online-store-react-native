import {useQuery} from "convex/react";
import {useCallback, useEffect} from "react";
import {ScrollView, Text, View, Pressable} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import {router} from "expo-router";

import {api} from "@/convex/_generated/api";

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({label, value}: InfoRowProps) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700">
    <Text className="text-gray-500 dark:text-white">{label}</Text>
    <Text className="font-medium dark:text-white">{value || "—"}</Text>
  </View>
);

const Profile = () => {
  const user = useQuery(api.users.getUser);

  const formatDate = useCallback((date?: string | number) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  }, []);

  const headerScale = useSharedValue(0.9);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerScale.value = withSpring(1);
    headerOpacity.value = withTiming(1, {duration: 500});
  }, [headerOpacity, headerScale]);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{scale: headerScale.value}],
    opacity: headerOpacity.value,
  }));

  const avatarScale = useSharedValue(1);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{scale: avatarScale.value}],
  }));

  return (
    <View style={{flex: 1}}>
      <ScrollView className="px-3">
        <Animated.View style={headerStyle} className="p-4 items-center mt-4">
          <Pressable
            onPressIn={() => (avatarScale.value = withSpring(0.95))}
            onPressOut={() => (avatarScale.value = withSpring(1))}
          >
            <Animated.Image
              source={{
                uri: user?.image as string,
              }}
              style={avatarStyle}
              className="h-48 w-48 rounded-full mb-3"
            />
          </Pressable>
          <Text className="text-xl font-bold dark:text-white capitalize">
            {user?.name}
          </Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </Animated.View>
        <View className="p-4 mt-4">
          <InfoRow label="Mobile" value={user?.mobileNumber || ""} />
          <InfoRow label="Username" value={user?.username || ""} />
          <InfoRow label="Gender" value={user?.gender || ""} />
          <InfoRow label="DOB" value={formatDate(user?.dob || "")} />
          <InfoRow
            label="Joined"
            value={formatDate(user?._creationTime || "")}
          />
        </View>
        <View className="mt-4">
          <Pressable
            onPress={() => router.push("/update-user")}
            className="bg-blue-600 p-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Update User
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/update-user-information")}
            className="bg-blue-600 p-3 rounded-xl my-3"
          >
            <Text className="text-white text-center font-semibold">
              Update User Information
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/update-user-image")}
            className="bg-blue-600 p-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Update User Image
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/address/manage")}
            className="bg-blue-600 p-3 rounded-xl mt-3"
          >
            <Text className="text-white text-center font-semibold">
              Manage Addresses
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
