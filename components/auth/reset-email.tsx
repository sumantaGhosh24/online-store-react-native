import {useSignIn} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {Link} from "expo-router";
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
          50,
        );
      }
    },
    [setSuccessfulCreation, signIn],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: "center"}}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Password
            </Text>
            <Text className="text-gray-500 mt-2">
              Enter your email to reset your password
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
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
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300)}
            className="mt-6 items-center gap-3"
          >
            <View className="flex-row">
              <Text className="text-gray-600 dark:text-white">
                Remember your password?{" "}
              </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-primary font-semibold">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetEmail;
