import {useSignIn} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link, useRouter} from "expo-router";
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
            50,
          );
        }
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
    [isLoaded, router, setActive, signIn],
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
              Welcome Back 👋
            </Text>
            <Text className="text-gray-500 mt-2">
              Sign in to continue shopping
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
            <AnimatedInput
              control={control}
              name="password"
              label="Password"
              secureTextEntry={!showPassword}
              error={errors.password?.message}
              setLoading={setLoading}
            />
            <Pressable
              onPress={() => setShowPassword((p) => !p)}
              className="flex-row items-center mb-4"
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
            <AnimatedButton
              title="Sign In"
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
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text className="text-primary font-semibold">Sign Up</Text>
                </Pressable>
              </Link>
            </View>
            <Link href="/reset" asChild>
              <Pressable>
                <Text className="text-primary">Forgot Password</Text>
              </Pressable>
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
