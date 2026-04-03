import {Ionicons} from "@expo/vector-icons";
import {useMutation} from "convex/react";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {useCallback, useState} from "react";
import {Alert, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";
import * as DropdownMenu from "zeego/dropdown-menu";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import AnimatedListItem from "../ui/animated-list-item";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface CouponProps {
  _id: string;
  name: string;
  code: string;
  discount: number;
  minCartPrice: number;
  _creationTime?: any;
  loading: boolean;
  index: number;
}

const Coupon = ({
  _id,
  name,
  code,
  discount,
  minCartPrice,
  _creationTime,
  loading,
  index,
}: CouponProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteCoupon = useMutation(api.coupons.deleteCoupon);

  const handleDeleteCoupon = useCallback(async () => {
    try {
      setDeleteLoading(true);

      Alert.alert(
        "Delete Coupon",
        "Are you sure you want to delete this coupon?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await deleteCoupon({id: _id as Id<"coupons">});

              ToastAndroid.showWithGravityAndOffset(
                "Coupon deleted successfully",
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
      setDeleteLoading(false);
    }
  }, [_id, deleteCoupon]);

  return (
    <AnimatedListItem index={index}>
      <View className="w-full">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 gap-1">
            <ShimmerPlaceholder width={120} height={14} visible={!loading}>
              <Text className="text-xs text-gray-500 dark:text-white">
                {_id}
              </Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={160} height={20} visible={!loading}>
              <Text className="text-lg font-semibold dark:text-white capitalize">
                {name}
              </Text>
            </ShimmerPlaceholder>
          </View>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <TouchableOpacity className="p-1">
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={Colors.background}
                />
              </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                key="update"
                onSelect={() => router.push(`/coupon/update/${_id}`)}
                disabled={loading || deleteLoading}
              >
                <DropdownMenu.ItemTitle>Update</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                key="delete"
                onSelect={() => handleDeleteCoupon()}
                disabled={loading || deleteLoading}
              >
                <DropdownMenu.ItemTitle className="text-red-500">
                  Delete
                </DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </View>
        <ShimmerPlaceholder width={100} height={28} visible={!loading}>
          <View className="self-start mt-2 bg-primary/10 px-3 py-1 rounded-full">
            <Text className="text-primary font-semibold text-sm uppercase tracking-wide">
              {code}
            </Text>
          </View>
        </ShimmerPlaceholder>
        <View className="h-[1px] bg-gray-200 dark:bg-gray-800 my-3" />
        <View className="flex-row justify-between">
          <ShimmerPlaceholder width={100} height={20} visible={!loading}>
            <View>
              <Text className="text-xs text-gray-500 dark:text-white">
                Discount
              </Text>
              <Text className="text-base font-bold text-green-600">
                ₹{discount}
              </Text>
            </View>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={120} height={20} visible={!loading}>
            <View>
              <Text className="text-xs text-gray-500 dark:text-white">
                Min. Cart
              </Text>
              <Text className="text-base font-bold dark:text-white">
                ₹{minCartPrice}
              </Text>
            </View>
          </ShimmerPlaceholder>
        </View>
        <View className="mt-3 flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
          <ShimmerPlaceholder width={140} height={14} visible={!loading}>
            <Text className="text-xs text-gray-500 dark:text-white">
              Created: {new Date(_creationTime as any).toLocaleDateString()}
            </Text>
          </ShimmerPlaceholder>
        </View>
      </View>
    </AnimatedListItem>
  );
};

export default Coupon;
