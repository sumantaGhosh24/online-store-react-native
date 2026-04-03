import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {Text, TouchableOpacity, View} from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

import {Colors} from "@/constant/colors";

import AnimatedListItem from "../ui/animated-list-item";

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
  index: number;
  isOwner?: boolean;
  orderItems: {
    product: {
      images: any;
    };
    quantity: number;
  }[];
}

const Order = ({
  _id,
  user,
  finalPrice,
  paymentStatus,
  isDelivered,
  _creationTime,
  index,
  isOwner,
  orderItems,
}: OrderProps) => {
  return (
    <AnimatedListItem index={index}>
      <View className="flex-1 gap-1.5">
        {isOwner ? (
          <>
            <Text className="text-lg font-bold dark:text-white">
              {orderItems.length} items
            </Text>
          </>
        ) : (
          <>
            <Text className="text-xs font-bold dark:text-white">{_id}</Text>
            <Text className="text-lg capitalize font-bold dark:text-white">
              User: {user?.name}
            </Text>
          </>
        )}
        <View className="flex flex-row items-center gap-3">
          <Text className="dark:text-white font-bold">₹ {finalPrice}</Text>
          <Text
            className={`text-white font-bold uppercase px-1 rounded ${paymentStatus === "completed" ? "bg-green-500" : "bg-orange-500"}`}
          >
            {paymentStatus === "completed" ? "paid" : "not paid"}
          </Text>
          <Text
            className={`text-white font-bold uppercase px-1 rounded ${isDelivered ? "bg-green-500" : "bg-orange-500"}`}
          >
            {isDelivered ? "delivered" : "shipping"}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-1">
          <Ionicons name="refresh-circle" size={14} color={Colors.background} />
          <Text className="text-xs dark:text-white">
            Created at: {new Date(_creationTime as any).toLocaleDateString()}
          </Text>
        </View>
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
              <DropdownMenu.ItemTitle>View Details</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </AnimatedListItem>
  );
};

export default Order;
