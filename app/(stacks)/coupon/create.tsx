import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "convex/react";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";

const createCouponSchema = z
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
type CreateCouponForm = z.infer<typeof createCouponSchema>;

const CreateCoupon = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CreateCouponForm>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      name: "",
      code: "",
      discount: "0",
      minCartPrice: "0",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const createCoupon = useMutation(api.coupons.createCoupon);

  const onSubmit = useCallback(
    async (data: CreateCouponForm) => {
      setLoading("loading");

      try {
        await createCoupon({
          name: data.name.toLowerCase(),
          code: data.code.toLowerCase(),
          discount: parseInt(data.discount),
          minCartPrice: parseInt(data.minCartPrice),
        });

        reset();

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Coupon created successfully",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      }
    },
    [createCoupon, reset]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="px-3 mt-5"
    >
      <View>
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Create Coupon
        </Text>
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
          title="Create Coupon"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateCoupon;
