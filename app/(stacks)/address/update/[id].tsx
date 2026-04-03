import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "convex/react";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {useLocalSearchParams} from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {SafeAreaView} from "react-native-safe-area-context";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const updateAddressSchema = z.object({
  name: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  zip: z.string().min(2).max(20),
  addressline: z.string().min(5).max(100),
});

type UpdateAddressForm = z.infer<typeof updateAddressSchema>;

const UpdateAddress = () => {
  const {id} = useLocalSearchParams();

  const address = useQuery(api.addresses.getAddress, {
    id: id as Id<"addresses">,
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateAddressForm>({
    resolver: zodResolver(updateAddressSchema),
    values: {
      name: address?.name || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || "",
      zip: address?.zip || "",
      addressline: address?.addressline || "",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const updateAddress = useMutation(api.addresses.updateAddress);

  const onSubmit = useCallback(
    async (data: UpdateAddressForm) => {
      setLoading("loading");

      try {
        await updateAddress({
          id: id as Id<"addresses">,
          name: data.name,
          city: data.city,
          state: data.state,
          country: data.country,
          zip: data.zip,
          addressline: data.addressline,
        });

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Address updated successfully",
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
    [updateAddress, id],
  );

  return (
    <SafeAreaView style={{flex: 1}} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Update Address
          </Text>
          <Animated.View entering={FadeInDown.delay(300)} className="mt-6">
            <AnimatedInput
              control={control}
              name="name"
              label="Name"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.name?.message}
              setLoading={setLoading}
            />
            <AnimatedInput
              control={control}
              name="city"
              label="City"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.city?.message}
              setLoading={setLoading}
            />
            <AnimatedInput
              control={control}
              name="state"
              label="State"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.state?.message}
              setLoading={setLoading}
            />
            <AnimatedInput
              control={control}
              name="country"
              label="Country"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.country?.message}
              setLoading={setLoading}
            />
            <AnimatedInput
              control={control}
              name="zip"
              label="ZIP Code"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.zip?.message}
              setLoading={setLoading}
            />
            <AnimatedInput
              control={control}
              name="addressline"
              label="Address Line"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.addressline?.message}
              setLoading={setLoading}
            />
            <AnimatedButton
              title="Update Address"
              state={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateAddress;
