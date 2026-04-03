import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "convex/react";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {z} from "zod";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

const couponSchema = z.object({
  code: z.string().min(1),
});
type CouponForm = z.infer<typeof couponSchema>;

interface CartApplyCouponProps {
  total: number;
}

const CartApplyCoupon = ({total}: CartApplyCouponProps) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
    },
  });

  const {setCoupon, removeCoupon} = useCartStore();

  const [loading, setLoading] = useState(false);

  const validateCoupon = useMutation(api.payments.validateCoupon);

  const onSubmit = async (data: CouponForm) => {
    try {
      setLoading(true);

      const {
        status,
        message,
        coupon: couponId,
      } = await validateCoupon({
        couponCode: data.code.toLowerCase(),
        total: total ?? 0,
      });

      if (status === "success") {
        setCoupon(couponId as Id<"coupons">);
      }
      if (status === "error") {
        reset();
        removeCoupon();
      }

      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 pt-10 mb-3 bg-white dark:bg-gray-800">
      <Text className="text-base font-semibold mb-2 dark:text-white">
        Apply Coupon
      </Text>
      <View className="flex-row items-center gap-2">
        <Controller
          control={control}
          name="code"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter code"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />
          )}
        />
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className="bg-primary px-4 py-2 rounded-xl justify-center items-center disabled:bg-blue-300"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Apply</Text>
          )}
        </TouchableOpacity>
      </View>
      {errors.code && (
        <Text className="text-red-500 text-xs mt-2">{errors.code.message}</Text>
      )}
    </View>
  );
};

export default CartApplyCoupon;
