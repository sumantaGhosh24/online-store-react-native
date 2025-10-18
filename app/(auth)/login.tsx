import {useSignIn} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link, useRouter} from "expo-router";
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
  const [loading, setLoading] = useState(false);

  const {signIn, setActive, isLoaded} = useSignIn();

  const onSubmit = async (data: SignInForm) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({session: signInAttempt.createdSessionId});
        router.replace("/home");
      } else {
        ToastAndroid.showWithGravityAndOffset(
          JSON.stringify(signInAttempt, null, 2),
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
          Sign in user
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
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">Sign In</Text>
          )}
        </TouchableOpacity>
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
