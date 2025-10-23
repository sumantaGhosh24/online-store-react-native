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
  code: z.string(),
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
        100
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 pt-10 mb-3 bg-white dark:bg-gray-800">
      <Controller
        control={control}
        name="code"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Enter coupon code"
            keyboardType="default"
            autoCapitalize="none"
          />
        )}
      />
      {errors.code && (
        <Text className="text-red-500 mb-2">{errors.code.message}</Text>
      )}
      <TouchableOpacity
        className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-medium text-white">
            Validate Coupon
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CartApplyCoupon;
