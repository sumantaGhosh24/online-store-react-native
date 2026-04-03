import {useSignUp} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "expo-router";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";

const verificationSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

const RegisterVerify = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {isLoaded, signUp, setActive} = useSignUp();

  const onSubmit = useCallback(
    async (data: VerificationForm) => {
      if (!isLoaded) return;

      setLoading("loading");
      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code: data.code,
        });

        if (signUpAttempt.status === "complete") {
          await setActive({session: signUpAttempt.createdSessionId});
          setLoading("success");
          router.replace("/home");
        } else {
          setLoading("error");
          ToastAndroid.showWithGravityAndOffset(
            JSON.stringify(signUpAttempt, null, 2),
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
    [isLoaded, router, setActive, signUp],
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
              Verify Register 👋
            </Text>
            <Text className="text-gray-500 mt-2">
              Verify your email to continue shopping
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
            <AnimatedInput
              control={control}
              name="code"
              label="Verification Code"
              keyboardType="numeric"
              autoCapitalize="none"
              maxLength={6}
              error={errors.code?.message}
              setLoading={setLoading}
            />
            <AnimatedButton
              title="Verify"
              state={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterVerify;
