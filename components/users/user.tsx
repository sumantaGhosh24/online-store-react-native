import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {Image, Text, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";

import AnimatedListItem from "../ui/animated-list-item";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface InfoProps {
  icon: any;
  text: string;
  loading: boolean;
}

const InfoRow = ({icon, text, loading}: InfoProps) => (
  <ShimmerPlaceholder width={180} height={16} visible={!loading}>
    <View className="flex-row items-center gap-2">
      <Ionicons name={icon} size={16} color="#9CA3AF" />
      <Text className="text-sm text-gray-700 dark:text-white">{text}</Text>
    </View>
  </ShimmerPlaceholder>
);

const InfoChip = ({icon, text, loading}: InfoProps) => (
  <ShimmerPlaceholder width={100} height={26} visible={!loading}>
    <View className="flex-row items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
      <Ionicons name={icon} size={14} color="#6B7280" />
      <Text className="text-xs text-gray-600 dark:text-white">{text}</Text>
    </View>
  </ShimmerPlaceholder>
);

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
  role?: string;
  _creationTime?: any;
  loading: boolean;
  index: number;
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
  role,
  _creationTime,
  loading,
  index,
}: UserProps) => {
  return (
    <AnimatedListItem index={index}>
      <View className="w-full">
        <View className="flex-row items-center gap-3">
          <ShimmerPlaceholder
            width={60}
            height={60}
            shimmerStyle={{borderRadius: 30}}
            visible={!loading}
          >
            <Image source={{uri: image}} className="h-16 w-16 rounded-full" />
          </ShimmerPlaceholder>
          <View className="flex-1">
            <ShimmerPlaceholder width={120} height={18} visible={!loading}>
              <Text className="text-lg font-semibold dark:text-white capitalize">
                {name}
              </Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={160} height={14} visible={!loading}>
              <Text className="text-xs text-gray-500 dark:text-white">
                {_id} • {externalId}
              </Text>
            </ShimmerPlaceholder>
          </View>
          <ShimmerPlaceholder width={70} height={24} visible={!loading}>
            <Text className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold capitalize">
              {role}
            </Text>
          </ShimmerPlaceholder>
        </View>
        <View className="h-[1px] bg-gray-200 dark:bg-gray-800 my-3" />
        <View className="gap-2">
          <InfoRow icon="mail" text={email} loading={loading} />
          {username && <InfoRow icon="at" text={username} loading={loading} />}
          {mobileNumber && (
            <InfoRow icon="call" text={mobileNumber} loading={loading} />
          )}
        </View>
        {(dob || gender) && (
          <View className="flex-row gap-4 mt-3">
            {dob && <InfoChip icon="calendar" text={dob} loading={loading} />}
            {gender && (
              <InfoChip icon="people" text={gender} loading={loading} />
            )}
          </View>
        )}
        <View className="mt-3 flex-row justify-between items-center">
          <ShimmerPlaceholder width={140} height={14} visible={!loading}>
            <Text className="text-xs text-gray-500 dark:text-white">
              Joined: {new Date(_creationTime as any).toLocaleDateString()}
            </Text>
          </ShimmerPlaceholder>
        </View>
      </View>
    </AnimatedListItem>
  );
};

export default User;
