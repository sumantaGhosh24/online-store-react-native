import {useSignUp} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "expo-router";
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

  const [loading, setLoading] = useState(false);

  const {isLoaded, signUp, setActive} = useSignUp();

  const onSubmit = async (data: VerificationForm) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({session: signUpAttempt.createdSessionId});
        router.replace("/home");
      } else {
        ToastAndroid.showWithGravityAndOffset(
          JSON.stringify(signUpAttempt, null, 2),
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Verify your email
        </Text>
        <Text className="text-base font-medium mb-2 dark:text-white">
          Enter verification code
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
              placeholder="Enter verification code"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.code && (
          <Text className="text-red-500 mb-2">{errors.code.message}</Text>
        )}
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterVerify;
