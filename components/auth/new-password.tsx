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

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";

const newPasswordSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    password: z.string().min(8, "Password is minimum 8 characters long"),
    cf_password: z.string().min(8, "Password is minimum 8 characters long"),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Passwords don't match",
    path: ["cf_password"],
  });

type NewPasswordForm = z.infer<typeof newPasswordSchema>;

const NewPassword = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      cf_password: "",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [showCf_password, setShowCf_password] = useState(false);

  const {signIn, setActive} = useSignIn();

  const onSubmit = useCallback(
    async (data: NewPasswordForm) => {
      setLoading("loading");

      try {
        const result = await signIn!.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: data.code,
          password: data.password,
        });

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Password reset successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );

        await setActive!({session: result.createdSessionId});
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
    [setActive, signIn],
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
              New Password
            </Text>
            <Text className="text-gray-500 mt-2">
              Create a new password to continue shopping
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
            <AnimatedInput
              control={control}
              name="code"
              label="Reset Code"
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
              error={errors.code?.message}
              setLoading={setLoading}
            />
            <AnimatedInput
              control={control}
              name="password"
              label="Password"
              secureTextEntry={!showPassword}
              error={errors.password?.message}
              setLoading={setLoading}
            />
            <Pressable
              className="flex-row items-center mb-4"
              onPress={() => setShowPassword((p) => !p)}
            >
              <View
                className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
                  showPassword
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400"
                }`}
              />
              <Text className="text-gray-600 dark:text-white">
                Show password
              </Text>
            </Pressable>
            <AnimatedInput
              control={control}
              name="cf_password"
              label="Confirm Password"
              secureTextEntry={!showCf_password}
              error={errors.cf_password?.message}
              setLoading={setLoading}
            />
            <Pressable
              className="flex-row items-center mb-4"
              onPress={() => setShowCf_password((prev) => !prev)}
            >
              <View
                className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
                  showCf_password
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400"
                }`}
              />
              <Text className="text-gray-600 dark:text-white">
                Show confirm password
              </Text>
            </Pressable>
            <AnimatedButton
              title="New Password"
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

export default NewPassword;
