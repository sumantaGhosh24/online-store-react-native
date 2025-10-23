import {useSignIn} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link, useRouter} from "expo-router";
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

const signInSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(8, "Password is minimum 8 characters long"),
});
type SignInForm = z.infer<typeof signInSchema>;

const Login = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {signIn, setActive, isLoaded} = useSignIn();

  const onSubmit = useCallback(
    async (data: SignInForm) => {
      if (!isLoaded) return;

      setLoading("loading");
      try {
        const signInAttempt = await signIn.create({
          identifier: data.email,
          password: data.password,
        });

        if (signInAttempt.status === "complete") {
          await setActive({session: signInAttempt.createdSessionId});
          setLoading("success");
          router.replace("/home");
        } else {
          setLoading("error");
          ToastAndroid.showWithGravityAndOffset(
            JSON.stringify(signInAttempt, null, 2),
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
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
    [isLoaded, router, setActive, signIn]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Sign in user
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
        <AnimatedButton
          title="Sign In"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600 dark:text-white">
            Already have an account?{" "}
          </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600 dark:text-white">
            Don&apos;t remember your password?{" "}
          </Text>
          <Link href="/reset" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">
                Forgot Password
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
