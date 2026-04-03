import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "convex/react";
import {memo, useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const createRatingSchema = z.object({
  comment: z.string().min(3).max(100),
  rating: z
    .string()
    .min(1)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 5;
    }, "Rating must be a number between 1 and 5"),
});
type CreateRatingForm = z.infer<typeof createRatingSchema>;

interface AddProductReviewProps {
  id: Id<"products">;
}

const AddProductReview = memo(({id}: AddProductReviewProps) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CreateRatingForm>({
    resolver: zodResolver(createRatingSchema),
    defaultValues: {
      comment: "",
      rating: "1",
    },
  });

  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const createReview = useMutation(api.reviews.createReview);

  const onSubmit = useCallback(
    async (data: CreateRatingForm) => {
      setLoading("loading");

      try {
        await createReview({
          productId: id as Id<"products">,
          comment: data.comment,
          rating: parseInt(data.rating),
        });

        reset();

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Product review created successfully",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
      }
    },
    [createReview, id, reset],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="mt-5"
    >
      <View>
        <Text className="text-lg font-bold mb-5 dark:text-white">
          Create Review
        </Text>
        <AnimatedInput
          control={control}
          name="comment"
          label="Review Comment"
          keyboardType="default"
          autoCapitalize="none"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          error={errors.comment?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="rating"
          label="Review Rating"
          keyboardType="numeric"
          autoCapitalize="none"
          maxLength={1}
          error={errors.rating?.message}
          setLoading={setLoading}
        />
        <AnimatedButton
          title="Create Review"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAvoidingView>
  );
});

AddProductReview.displayName = "AddProductReview";

export default AddProductReview;
