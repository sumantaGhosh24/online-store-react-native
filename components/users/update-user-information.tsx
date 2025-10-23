import {zodResolver} from "@hookform/resolvers/zod";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {useMutation, useQuery} from "convex/react";
import {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {z} from "zod";

import {api} from "@/convex/_generated/api";

import AnimatedButton from "../ui/animated-button";
import AnimatedInput from "../ui/animated-input";

const updateUserInformationSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .min(10, "Mobile number is invalid")
    .max(10, "Mobile number is invalid"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username is invalid")
    .max(50, "Username is invalid"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "Zip is required"),
  addressline: z.string().min(1, "Addressline is required"),
});
type UpdateUserInformationForm = z.infer<typeof updateUserInformationSchema>;

const UpdateUserInformation = () => {
  const user = useQuery(api.users.getUser);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateUserInformationForm>({
    resolver: zodResolver(updateUserInformationSchema),
    defaultValues: {
      mobileNumber: user?.mobileNumber || "",
      username: user?.username || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      zip: user?.zip || "",
      addressline: user?.addressline || "",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [date, setDate] = useState<Date>(
    user?.dob ? new Date(user.dob) : new Date()
  );
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState(user?.gender || "");

  const onChange = (selectedDate?: any) => {
    setShow(false);
    if (selectedDate) {
      setDate(new Date(selectedDate?.nativeEvent?.timestamp));
    }
  };

  const updateUser = useMutation(api.users.updateUserDetails);

  const onSubmit = useCallback(
    async (data: UpdateUserInformationForm) => {
      setLoading("loading");

      try {
        await updateUser({
          mobileNumber: data.mobileNumber,
          username: data.username,
          city: data.city,
          state: data.state,
          country: data.country,
          zip: data.zip,
          addressline: data.addressline,
          dob: String(date),
          gender,
        });

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "User information updated successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
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
    [date, gender, updateUser]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Update User Information
        </Text>
        <AnimatedInput
          control={control}
          name="mobileNumber"
          label="Mobile Number"
          keyboardType="numeric"
          autoCapitalize="none"
          maxLength={10}
          error={errors.mobileNumber?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="username"
          label="Username"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.username?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="city"
          label="City"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.city?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="state"
          label="State"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.state?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="country"
          label="Country"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.country?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="zip"
          label="Zip"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.zip?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="addressline"
          label="Addressline"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.addressline?.message}
          setLoading={setLoading}
        />
        <Text className="mb-1.5 font-bold">
          {!date ? new Date().toDateString() : new Date(date).toDateString()}
        </Text>
        <AnimatedButton
          onPress={() => setShow(true)}
          title="Select date of birth"
          state="idle"
        />
        {show && (
          <RNDateTimePicker
            value={date}
            mode="date"
            onChange={onChange as any}
            minimumDate={new Date(1990, 0, 1)}
            maximumDate={new Date()}
          />
        )}
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Select your gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        <AnimatedButton
          title="Update User Information"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateUserInformation;
