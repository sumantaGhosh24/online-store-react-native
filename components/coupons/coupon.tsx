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
      setDeleteLoading(false);
    }
  }, [_id, deleteCoupon]);

  return (
    <AnimatedListItem index={index}>
      <View className="flex-1 gap-1.5">
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-xs font-bold dark:text-white">{_id}</Text>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-xl capitalize font-bold dark:text-white">
            {name}
          </Text>
          <Text className="text-lg font-bold uppercase bg-primary text-white py-1 px-2 rounded-md">
            {code}
          </Text>
        </ShimmerPlaceholder>
        <View className="flex flex-row items-center gap-3">
          <ShimmerPlaceholder width={50} height={20} visible={!loading}>
            <Text className="dark:text-white text-base font-bold">
              Discount: ₹{discount}
            </Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={50} height={20} visible={!loading}>
            <Text className="dark:text-white text-base font-bold">
              Minimum price: ₹{minCartPrice}
            </Text>
          </ShimmerPlaceholder>
        </View>
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
              <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </AnimatedListItem>
  );
};

export default Coupon;
