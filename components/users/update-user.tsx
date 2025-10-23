import {useUser} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
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

import AnimatedButton from "../ui/animated-button";
import AnimatedInput from "../ui/animated-input";

const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name is minimum 3 characters long")
    .max(50, "First name is maximum 50 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name is minimum 3 characters long")
    .max(50, "Last name is maximum 50 characters long"),
});
type UpdateUserForm = z.infer<typeof updateUserSchema>;

const UpdateUser = () => {
  const {isLoaded, user} = useUser();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const onSubmit = useCallback(
    async (data: UpdateUserForm) => {
      if (!isLoaded) return;

      setLoading("loading");
      try {
        await user?.update({
          firstName: data.firstName,
          lastName: data.lastName,
        });

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "User updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    },
    [isLoaded, user]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Update User
        </Text>
        <AnimatedInput
          control={control}
          name="firstName"
          label="First Name"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.firstName?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="lastName"
          label="Last Name"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.lastName?.message}
          setLoading={setLoading}
        />
        <AnimatedButton
          title="Update User"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateUser;
