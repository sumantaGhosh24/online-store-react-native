import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "convex/react";
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
import {Id} from "@/convex/_generated/dataModel";

const createRatingSchema = z.object({
  comment: z.string().min(3).max(100),
  rating: z.string().min(1),
});
type CreateRatingForm = z.infer<typeof createRatingSchema>;

interface AddProductReviewProps {
  id: Id<"products">;
}

const AddProductReview = ({id}: AddProductReviewProps) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CreateRatingForm>({
    resolver: zodResolver(createRatingSchema),
    defaultValues: {
      comment: "",
      rating: "0",
    },
  });

  const [loading, setLoading] = useState(false);

  const createReview = useMutation(api.reviews.createReview);

  const onSubmit = async (data: CreateRatingForm) => {
    if (isNaN(parseInt(data.rating)))
      return ToastAndroid.showWithGravityAndOffset(
        "Rating should be a number",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    if (parseInt(data.rating) < 1)
      return ToastAndroid.showWithGravityAndOffset(
        "Rating should be greater than 1",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    if (parseInt(data.rating) > 5)
      return ToastAndroid.showWithGravityAndOffset(
        "Rating should be less than 5",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );

    try {
      setLoading(true);

      await createReview({
        productId: id as Id<"products">,
        comment: data.comment,
        rating: parseInt(data.rating),
      });

      reset();

      ToastAndroid.showWithGravityAndOffset(
        "Product review created successfully",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="mt-5"
    >
      <View>
        <Text className="text-lg font-bold mb-2 dark:text-white">
          Create Review
        </Text>
        <Controller
          control={control}
          name="comment"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white h-[90px]"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter review comment"
              keyboardType="default"
              autoCapitalize="none"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          )}
        />
        {errors.comment && (
          <Text className="text-red-500 mb-2">{errors.comment.message}</Text>
        )}
        <Controller
          control={control}
          name="rating"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter review rating"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.rating && (
          <Text className="text-red-500 mb-2">{errors.rating.message}</Text>
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
              Create Review
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductReview;
