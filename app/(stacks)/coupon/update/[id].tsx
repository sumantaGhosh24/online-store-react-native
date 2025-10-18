import {Ionicons} from "@expo/vector-icons";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "convex/react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {z} from "zod";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const updateCouponSchema = z.object({
  name: z.string().min(2).max(50),
  code: z.string().min(2).max(15),
  discount: z.string().min(1),
  minCartPrice: z.string().min(1),
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

  const [loading, setLoading] = useState(false);

  const updateCoupon = useMutation(api.coupons.updateCoupon);

  const onSubmit = async (data: UpdateCouponForm) => {
    if (isNaN(parseInt(data.discount)))
      return ToastAndroid.showWithGravityAndOffset(
        "Discount must be a number",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    if (isNaN(parseInt(data.minCartPrice)))
      return ToastAndroid.showWithGravityAndOffset(
        "Minimum cart price must be a number",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    try {
      setLoading(true);

      await updateCoupon({
        id: id as Id<"coupons">,
        name: data.name.toLowerCase(),
        code: data.code.toLowerCase(),
        discount: parseInt(data.discount),
        minCartPrice: parseInt(data.minCartPrice),
      });

      ToastAndroid.showWithGravityAndOffset(
        "Coupon updated successfully",
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="px-3 mt-5"
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          headerLeft: () => (
            <TouchableOpacity
              className="items-center justify-center mr-5"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Update Coupon
        </Text>
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Coupon name
        </Text>
        <Controller
          control={control}
          name="name"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter coupon name"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 mb-2">{errors.name.message}</Text>
        )}
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Coupon code
        </Text>
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
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Coupon discount
        </Text>
        <Controller
          control={control}
          name="discount"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter coupon discount"
              keyboardType="number-pad"
            />
          )}
        />
        {errors.discount && (
          <Text className="text-red-500 mb-2">{errors.discount.message}</Text>
        )}
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Coupon minimum cart price
        </Text>
        <Controller
          control={control}
          name="minCartPrice"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter coupon minimum cart price"
              keyboardType="number-pad"
            />
          )}
        />
        {errors.minCartPrice && (
          <Text className="text-red-500 mb-2">
            {errors.minCartPrice.message}
          </Text>
        )}
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center my-5 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Update Coupon
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateCoupon;
