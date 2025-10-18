import {useSignIn} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
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

  const [loading, setLoading] = useState(false);

  const {signIn} = useSignIn();

  const onSubmit = async (data: ResetEmailForm) => {
    try {
      setLoading(true);

      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });

      setSuccessfulCreation(true);
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
          Forgot Password
        </Text>
        <Text className="text-base font-medium mb-2 dark:text-white">
          Enter email address
        </Text>
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mb-2">{errors.email.message}</Text>
        )}
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Forgot Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetEmail;
