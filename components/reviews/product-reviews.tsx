import {usePaginatedQuery} from "convex/react";
import {router} from "expo-router";
import {memo} from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";

import {PAGINATION_MAX_COUNT} from "@/constant";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import EmptyState from "../ui/empty-state";
import ProductReview from "./product-review";

interface ProductReviewsProps {
  id: Id<"products">;
}

const ProductReviews = memo(({id}: ProductReviewsProps) => {
  const {results, status, loadMore, isLoading} = usePaginatedQuery(
    api.reviews.getPaginatedReviews,
    {productId: id},
    {initialNumItems: PAGINATION_MAX_COUNT},
  );

  const hasMore = status === "CanLoadMore";

  return (
    <View className="mb-5">
      <Text className="text-lg font-bold dark:text-white mb-3">Reviews</Text>
      {results.length > 0 ? (
        results.map((review, index) => (
          <ProductReview
            {...review}
            loading={isLoading}
            key={review._id}
            index={index}
          />
        ))
      ) : (
        <EmptyState
          title="No reviews found"
          subtitle="Create a review"
          buttonTitle="Go Home"
          handlePress={() => router.push("/home")}
        />
      )}
      {hasMore && (
        <TouchableOpacity
          className="bg-primary rounded-full py-2 mt-3 disabled:bg-blue-300"
          onPress={() => loadMore(PAGINATION_MAX_COUNT)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">Load More</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});

ProductReviews.displayName = "ProductReviews";

export default ProductReviews;
