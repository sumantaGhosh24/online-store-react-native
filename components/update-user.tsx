import {useUser} from "@clerk/clerk-expo";
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

const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name is minimum 3 characters long")
    .max(50, "First name is maximum 50 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name is minimum 3 characters long")
    .max(50, "Last name is maximum 50 characters long"),
});
type UpdateUserForm = z.infer<typeof updateUserSchema>;

const UpdateUser = () => {
  const {isLoaded, user} = useUser();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: UpdateUserForm) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      await user?.update({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      ToastAndroid.showWithGravityAndOffset(
        "User updated successfully",
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
          Update User
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
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">Update User</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateUser;
