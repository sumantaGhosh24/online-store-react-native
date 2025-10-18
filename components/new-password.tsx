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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCf_password, setShowCf_password] = useState(false);

  const {signIn, setActive} = useSignIn();

  const onSubmit = async (data: NewPasswordForm) => {
    try {
      setLoading(true);

      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Password reset successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      await setActive!({session: result.createdSessionId});
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
          Enter new password
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
              placeholder="Enter reset code"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.code && (
          <Text className="text-red-500 mb-2">{errors.code.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              accessibilityLabel="password"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mb-2">{errors.password.message}</Text>
        )}
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
        <Controller
          control={control}
          name="cf_password"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter confirm password"
              secureTextEntry={!showCf_password}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              accessibilityLabel="Confirm password"
            />
          )}
        />
        {errors.cf_password && (
          <Text className="text-red-500 mb-2">
            {errors.cf_password.message}
          </Text>
        )}
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
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">New Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewPassword;
