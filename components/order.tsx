import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {Text, TouchableOpacity, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";
import * as DropdownMenu from "zeego/dropdown-menu";

import {Colors} from "@/constant/colors";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface OrderProps {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  finalPrice: number;
  paymentStatus: string;
  isDelivered: boolean;
  _creationTime?: any;
  loading: boolean;
}

const Order = ({
  _id,
  user,
  finalPrice,
  paymentStatus,
  isDelivered,
  _creationTime,
  loading,
}: OrderProps) => {
  return (
    <View className="flex-row items-center gap-4 px-5 py-3 bg-gray-200 dark:bg-gray-800 mx-3 my-2 rounded-md">
      <View className="flex-1 gap-1.5">
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-xs font-bold dark:text-white">{_id}</Text>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-lg capitalize font-bold dark:text-white">
            User: {user?.name}
          </Text>
        </ShimmerPlaceholder>
        <View className="flex flex-row items-center gap-3">
          <ShimmerPlaceholder width={50} height={20} visible={!loading}>
            <Text className="dark:text-white font-bold">₹ {finalPrice}</Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={50} height={20} visible={!loading}>
            <Text className="text-white font-bold uppercase bg-primary px-1 rounded">
              {paymentStatus}
            </Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={50} height={20} visible={!loading}>
            <Text className="text-white font-bold uppercase bg-primary px-1 rounded">
              {isDelivered ? "delivered" : "pending"}
            </Text>
          </ShimmerPlaceholder>
        </View>
        <ShimmerPlaceholder
          width={75}
          height={20}
          style={{marginBottom: 5}}
          visible={!loading}
        >
          <View className="flex flex-row items-center gap-1">
            <Ionicons
              name="refresh-circle"
              size={14}
              color={Colors.background}
            />
            <Text className="text-xs dark:text-white">
              Created at: {new Date(_creationTime as any).toLocaleDateString()}
            </Text>
          </View>
        </ShimmerPlaceholder>
      </View>
      <View>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <TouchableOpacity>
              <Ionicons name="settings" size={32} color={Colors.background} />
            </TouchableOpacity>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              key="view"
              onSelect={() => router.push(`/order/details/${_id}`)}
            >
              <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </View>
  );
};

export default Order;
