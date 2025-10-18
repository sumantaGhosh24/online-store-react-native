import {useSignUp} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "expo-checkbox";
import * as Linking from "expo-linking";
import {Link} from "expo-router";
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

import RegisterVerify from "@/components/register-verify";

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(3, "Too short")
      .max(50, "Too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(3, "Too short")
      .max(50, "Too long"),
    email: z.email().min(1, "Email is required"),
    password: z.string().min(8, "Password is minimum 8 characters long"),
    cf_password: z.string().min(8, "Password is minimum 8 characters long"),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Passwords don't match",
    path: ["cf_password"],
  });
type SignUpForm = z.infer<typeof signUpSchema>;

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      cf_password: "",
    },
  });

  const [isTermsChecked, setTermsChecked] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCf_password, setShowCf_password] = useState(false);
  const [loading, setLoading] = useState(false);

  const {isLoaded, signUp} = useSignUp();

  const onSubmit = async (data: SignUpForm) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({strategy: "email_code"});

      setPendingVerification(true);
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

  const handleLinkPress = (linkType: "terms" | "privacy") => {
    Linking.openURL(
      linkType === "terms" ? "https://www.lipsum.com" : "https://www.lipsum.com"
    );
  };

  if (pendingVerification) {
    return <RegisterVerify />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Sign up user
        </Text>
        <Text className="text-base font-medium mb-2 dark:text-white">
          Enter email address
        </Text>
        <Controller
          control={control}
          name="firstName"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter first name"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.firstName && (
          <Text className="text-red-500 mb-2">{errors.firstName.message}</Text>
        )}
        <Controller
          control={control}
          name="lastName"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter last name"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.lastName && (
          <Text className="text-red-500 mb-2">{errors.lastName.message}</Text>
        )}
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
              accessibilityLabel="Confirm Password"
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
          disabled={!isTermsChecked || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">Sign Up</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Checkbox
            value={isTermsChecked}
            onValueChange={(newValue) => {
              setTermsChecked(newValue);
            }}
            color={isTermsChecked ? "#155dfc" : undefined}
            className="mr-3"
          />
          <Text className="text-gray-400 text-md font-Poppins_500Medium flex-1 flex-wrap">
            I agree to the{" "}
            <Text
              className="text-black dark:text-white underline"
              onPress={() => handleLinkPress("terms")}
            >
              Terms of Service
            </Text>{" "}
            and acknowledge Captions&apos;{" "}
            <Text
              className="text-black dark:text-white underline"
              onPress={() => handleLinkPress("privacy")}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600 dark:text-white">
            Already have an account?{" "}
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
