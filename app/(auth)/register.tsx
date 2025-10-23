import {useSignUp} from "@clerk/clerk-expo";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "expo-checkbox";
import * as Linking from "expo-linking";
import {Link} from "expo-router";
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

import RegisterVerify from "@/components/auth/register-verify";
import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";

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
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {isLoaded, signUp} = useSignUp();

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      if (!isLoaded) return;

      if (!isTermsChecked)
        return ToastAndroid.showWithGravityAndOffset(
          "Please accept the terms and conditions",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

      setLoading("loading");
      try {
        await signUp.create({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.email,
          password: data.password,
        });

        await signUp.prepareEmailAddressVerification({strategy: "email_code"});

        setLoading("success");

        setPendingVerification(true);
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
    [isLoaded, isTermsChecked, signUp]
  );

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
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Sign up user
        </Text>
        <AnimatedInput
          control={control}
          name="firstName"
          label="First Name"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.firstName?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="lastName"
          label="Last Name"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.lastName?.message}
          setLoading={setLoading}
        />
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
          title="Sign Up"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
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
