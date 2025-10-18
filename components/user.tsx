import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {Image, Text, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";

import {Colors} from "@/constant/colors";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface UserProps {
  _id: string;
  name: string;
  externalId: string;
  email: string;
  image?: any;
  mobileNumber?: string;
  username?: string;
  dob?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  addressline?: string;
  role?: string;
  _creationTime?: any;
  loading: boolean;
}

const User = ({
  _id,
  externalId,
  name,
  email,
  image,
  mobileNumber,
  username,
  dob,
  gender,
  city,
  state,
  country,
  zip,
  addressline,
  role,
  _creationTime,
  loading,
}: UserProps) => {
  return (
    <View className="flex-row items-center gap-4 px-5 py-3 bg-gray-200 dark:bg-gray-800 mx-3 my-2 rounded-md">
      <ShimmerPlaceholder
        width={60}
        height={60}
        shimmerStyle={{borderRadius: 30}}
        visible={!loading}
      >
        <Image source={{uri: image}} className="h-16 w-16 rounded-full" />
      </ShimmerPlaceholder>
      <View className="flex-1 gap-1.5">
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-xs font-bold dark:text-white">
            {_id} | {externalId}
          </Text>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder width={160} height={20} visible={!loading}>
          <Text className="text-lg capitalize font-bold dark:text-white">
            {name}
          </Text>
          <View className="flex flex-row items-center gap-3">
            <Ionicons name="mail" size={18} color={Colors.background} />
            <Text className="text-base dark:text-white">{email}</Text>
          </View>
        </ShimmerPlaceholder>
        {username && (
          <ShimmerPlaceholder width={160} height={20} visible={!loading}>
            <View className="flex flex-row items-center gap-3">
              <Ionicons name="at-circle" size={18} color={Colors.background} />
              <Text className="text-base dark:text-white">{username}</Text>
            </View>
            <View className="flex flex-row items-center gap-3">
              <Ionicons name="call" size={18} color={Colors.background} />
              <Text className="text-base dark:text-white">{mobileNumber}</Text>
            </View>
            <View className="flex flex-row items-center gap-3">
              <Ionicons name="calendar" size={18} color={Colors.background} />
              <Text className="text-base dark:text-white">{dob}</Text>
            </View>
            <View className="flex flex-row items-center gap-3">
              <Ionicons name="people" size={18} color={Colors.background} />
              <Text className="text-base dark:text-white">{gender}</Text>
            </View>
          </ShimmerPlaceholder>
        )}
        {city && (
          <ShimmerPlaceholder width={140} height={20} visible={!loading}>
            <View className="flex flex-row items-center gap-3">
              <Ionicons
                name="navigate-circle"
                size={18}
                color={Colors.background}
              />
              <Text className="text-base dark:text-white">
                {city}, {state}, {country}, {zip}, {addressline}
              </Text>
            </View>
          </ShimmerPlaceholder>
        )}
        <ShimmerPlaceholder
          width={75}
          height={20}
          style={{marginBottom: 5}}
          visible={!loading}
        >
          <View className="flex flex-row items-center gap-3">
            <Ionicons
              name="refresh-circle"
              size={18}
              color={Colors.background}
            />
            <Text className="text-base dark:text-white">
              User since: {new Date(_creationTime as any).toLocaleDateString()}
            </Text>
          </View>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder width={75} height={20} visible={!loading}>
          <Text className="bg-primary text-white px-2 py-1.5 w-[60px] rounded capitalize">
            {role}
          </Text>
        </ShimmerPlaceholder>
      </View>
    </View>
  );
};

export default User;
