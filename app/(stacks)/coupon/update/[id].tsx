import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "convex/react";
import {useLocalSearchParams} from "expo-router";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {KeyboardAvoidingView, Platform, ToastAndroid, View} from "react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const updateCouponSchema = z
  .object({
    name: z.string().min(2).max(50),
    code: z.string().min(2).max(15),
    discount: z
      .string()
      .min(1)
      .refine((val) => {
        return !isNaN(parseInt(val));
      }, "Discount must be a number"),
    minCartPrice: z
      .string()
      .min(1)
      .refine((val) => {
        return !isNaN(parseInt(val));
      }, "Minimum cart price must be a number"),
  })
  .refine((data) => parseInt(data.discount) <= parseInt(data.minCartPrice), {
    message: "Discount cannot be greater than minimum cart price",
    path: ["discount"],
  });

type UpdateCouponForm = z.infer<typeof updateCouponSchema>;

const UpdateCoupon = () => {
  const {id} = useLocalSearchParams();

  const coupon = useQuery(api.coupons.getCoupon, {
    id: id as Id<"coupons">,
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateCouponForm>({
    resolver: zodResolver(updateCouponSchema),
    values: {
      name: coupon?.name || "",
      code: coupon?.code || "",
      discount: String(coupon?.discount) || "0",
      minCartPrice: String(coupon?.minCartPrice) || "0",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const updateCoupon = useMutation(api.coupons.updateCoupon);

  const onSubmit = useCallback(
    async (data: UpdateCouponForm) => {
      setLoading("loading");

      try {
        await updateCoupon({
          id: id as Id<"coupons">,
          name: data.name.toLowerCase(),
          code: data.code.toLowerCase(),
          discount: parseInt(data.discount),
          minCartPrice: parseInt(data.minCartPrice),
        });

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Coupon updated successfully",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
      }
    },
    [id, updateCoupon],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <View className="px-6">
        <Animated.View entering={FadeInDown.delay(300)} className="mt-6">
          <AnimatedInput
            control={control}
            name="name"
            label="Coupon Name"
            keyboardType="default"
            autoCapitalize="none"
            error={errors.name?.message}
            setLoading={setLoading}
          />
          <AnimatedInput
            control={control}
            name="code"
            label="Coupon Code"
            keyboardType="default"
            autoCapitalize="words"
            error={errors.code?.message}
            setLoading={setLoading}
          />
          <AnimatedInput
            control={control}
            name="discount"
            label="Coupon Discount"
            keyboardType="numeric"
            autoCapitalize="none"
            error={errors.discount?.message}
            setLoading={setLoading}
          />
          <AnimatedInput
            control={control}
            name="minCartPrice"
            label="Coupon Cart Minimum Price"
            keyboardType="numeric"
            autoCapitalize="none"
            error={errors.minCartPrice?.message}
            setLoading={setLoading}
          />
          <AnimatedButton
            title="Update Coupon"
            state={loading}
            onPress={handleSubmit(onSubmit)}
          />
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateCoupon;
