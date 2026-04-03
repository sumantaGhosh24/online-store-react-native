import {useQuery} from "convex/react";
import {useEffect} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";
import {Ionicons} from "@expo/vector-icons";

interface CartCouponProps {
  setDiscount: (discount: number) => void;
  checkout?: boolean;
}

const CartCoupon = ({setDiscount, checkout}: CartCouponProps) => {
  const {coupon, removeCoupon} = useCartStore();

  const couponData = useQuery(api.coupons.getCoupon, {
    id: coupon as Id<"coupons">,
  });

  useEffect(() => {
    setDiscount(couponData?.discount ?? 0);
  }, [couponData, setDiscount]);

  const handleRemoveCoupon = () => {
    removeCoupon();
    setDiscount(0);
  };

  return (
    <View className="flex-row items-center justify-between p-3 mb-3 bg-white dark:bg-gray-800">
      <View className="flex-row items-center gap-2">
        <Ionicons name="pricetag" size={18} color="#155dfc" />
        <View>
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            Coupon Applied
          </Text>
          <Text className="text-sm font-bold uppercase text-blue-700 dark:text-blue-300">
            {couponData?.code}
          </Text>
          <Text className="text-xs text-blue-600">
            Saved ₹{couponData?.discount}
          </Text>
        </View>
      </View>
      {!checkout && (
        <TouchableOpacity
          onPress={handleRemoveCoupon}
          className="flex-row items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full"
        >
          <Ionicons name="close-circle" size={16} color="#ef4444" />
          <Text className="text-xs font-semibold text-red-500">Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartCoupon;
