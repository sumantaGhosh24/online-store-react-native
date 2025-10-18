import {zodResolver} from "@hookform/resolvers/zod";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {useMutation, useQuery} from "convex/react";
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

import {api} from "@/convex/_generated/api";

import CustomButton from "./custom-button";

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

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState("");

  const onChange = (selectedDate?: any) => {
    setShow(false);
    if (selectedDate) {
      setDate(new Date(selectedDate?.nativeEvent?.timestamp));
    }
  };

  const updateUser = useMutation(api.users.updateUserDetails);

  const onSubmit = async (data: UpdateUserInformationForm) => {
    try {
      setLoading(true);

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

      ToastAndroid.showWithGravityAndOffset(
        "User information updated successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
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
      <View>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Update User Information
        </Text>
        <Controller
          control={control}
          name="mobileNumber"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter mobile number"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.mobileNumber && (
          <Text className="text-red-500 mb-2">
            {errors.mobileNumber.message}
          </Text>
        )}
        <Controller
          control={control}
          name="username"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter username"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.username && (
          <Text className="text-red-500 mb-2">{errors.username.message}</Text>
        )}
        <Controller
          control={control}
          name="city"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter city"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.city && (
          <Text className="text-red-500 mb-2">{errors.city.message}</Text>
        )}
        <Controller
          control={control}
          name="state"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter state"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.state && (
          <Text className="text-red-500 mb-2">{errors.state.message}</Text>
        )}
        <Controller
          control={control}
          name="country"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter country"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.country && (
          <Text className="text-red-500 mb-2">{errors.country.message}</Text>
        )}
        <Controller
          control={control}
          name="zip"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter zip"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.zip && (
          <Text className="text-red-500 mb-2">{errors.zip.message}</Text>
        )}
        <Controller
          control={control}
          name="addressline"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter addressline"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.addressline && (
          <Text className="text-red-500 mb-2">
            {errors.addressline.message}
          </Text>
        )}
        <Text className="mb-1.5 font-bold">
          {!date ? new Date().toDateString() : new Date(date).toDateString()}
        </Text>
        <CustomButton
          handlePress={() => setShow(true)}
          title="DOB"
          containerStyles="bg-primary mb-5"
        />
        {show && (
          <RNDateTimePicker
            value={date}
            mode="date"
            onChange={onChange as any}
            minimumDate={new Date(1990, 0, 1)}
            maximumDate={new Date(2025, 0, 1)}
          />
        )}
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Update User Information
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateUserInformation;
