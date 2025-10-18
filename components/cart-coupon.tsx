import {useQuery} from "convex/react";
import {useEffect} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

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
      <View className="flex flex-row items-center gap-2">
        <Text className="text-lg font-bold dark:text-white">Coupon Code: </Text>
        <Text className="text-xl font-bold uppercase dark:text-white">
          {couponData?.code}
        </Text>
      </View>
      {!checkout && (
        <TouchableOpacity
          className="bg-primary rounded-full py-3 px-4 items-center"
          onPress={handleRemoveCoupon}
        >
          <Text className="text-lg font-bold text-white">Remove Coupon</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartCoupon;
