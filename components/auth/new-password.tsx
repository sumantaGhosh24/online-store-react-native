import {useSignIn} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
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
          50
        );

        await setActive!({session: result.createdSessionId});
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
    [setActive, signIn]
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
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{checked: showPassword}}
          testID="show-password-checkbox"
        >
          <View
            className={`w-5 h-5 rounded border border-gray-400 mr-2 items-center justify-center ${
              showPassword ? "bg-blue-100 border-primary" : "bg-white"
            }`}
          >
            {showPassword && <View className="w-3 h-3 bg-primary rounded" />}
          </View>
          <Text className="text-base dark:text-white">Show password</Text>
        </TouchableOpacity>
        <AnimatedInput
          control={control}
          name="cf_password"
          label="Confirm Password"
          secureTextEntry={!showCf_password}
          error={errors.cf_password?.message}
          setLoading={setLoading}
        />
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setShowCf_password((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{checked: showCf_password}}
          testID="show-password-checkbox"
        >
          <View
            className={`w-5 h-5 rounded border border-gray-400 mr-2 items-center justify-center ${
              showCf_password ? "bg-blue-100 border-primary" : "bg-white"
            }`}
          >
            {showCf_password && <View className="w-3 h-3 bg-primary rounded" />}
          </View>
          <Text className="text-base dark:text-white">
            Show confirm password
          </Text>
        </TouchableOpacity>
        <AnimatedButton
          title="New Password"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewPassword;
