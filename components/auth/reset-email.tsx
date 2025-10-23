import {useSignIn} from "@clerk/clerk-expo";
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

interface ResetEmailProps {
  setSuccessfulCreation: (value: boolean) => void;
}

const resetEmailSchema = z.object({
  email: z.email("Invalid email").min(1, "Email is required"),
});
type ResetEmailForm = z.infer<typeof resetEmailSchema>;

const ResetEmail = ({setSuccessfulCreation}: ResetEmailProps) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ResetEmailForm>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {signIn} = useSignIn();

  const onSubmit = useCallback(
    async (data: ResetEmailForm) => {
      setLoading("loading");

      try {
        await signIn!.create({
          strategy: "reset_password_email_code",
          identifier: data.email,
        });

        setLoading("success");

        setSuccessfulCreation(true);
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
    [setSuccessfulCreation, signIn]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Forgot Password
        </Text>
        <AnimatedInput
          control={control}
          name="email"
          label="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email?.message}
          setLoading={setLoading}
        />
        <AnimatedButton
          title="Forgot Password"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetEmail;
