import {usePaginatedQuery} from "convex/react";
import {router} from "expo-router";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";

import {PAGINATION_MAX_COUNT} from "@/constant";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import EmptyState from "./empty-state";
import ProductReview from "./product-review";

interface ProductReviewsProps {
  id: Id<"products">;
}

const ProductReviews = ({id}: ProductReviewsProps) => {
  const {results, status, loadMore, isLoading} = usePaginatedQuery(
    api.reviews.getPaginatedReviews,
    {productId: id},
    {initialNumItems: PAGINATION_MAX_COUNT}
  );

  const hasMore = status === "CanLoadMore";

  return (
    <View className="mb-5">
      <View>
        <Text className="text-lg font-bold dark:text-white">Reviews</Text>
      </View>
      {results.length > 0 ? (
        results.map((review) => (
          <ProductReview {...review} loading={isLoading} key={review._id} />
        ))
      ) : (
        <EmptyState
          title="No reviews found"
          subtitle="Create a review"
          buttonTitle="Reload"
          handlePress={() => router.reload()}
        />
      )}
      {hasMore && (
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300 mx-5"
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
};

export default ProductReviews;
