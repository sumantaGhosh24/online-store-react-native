import {usePaginatedQuery} from "convex/react";
import {router} from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

import Coupon from "@/components/coupon";
import EmptyState from "@/components/empty-state";
import {PAGINATION_MAX_COUNT} from "@/constant";
import {api} from "@/convex/_generated/api";

const Coupons = () => {
  const {results, status, loadMore, isLoading} = usePaginatedQuery(
    api.coupons.getCouponsPaginated,
    {},
    {initialNumItems: PAGINATION_MAX_COUNT}
  );

  const hasMore = status === "CanLoadMore";

  return (
    <FlatList
      data={results}
      renderItem={({item}) => <Coupon {...item} loading={isLoading} />}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={{paddingBottom: 20}}
      ListFooterComponent={() =>
        hasMore && (
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
        )
      }
      ListEmptyComponent={() => (
        <EmptyState
          title="No coupons found"
          subtitle="Create a coupon"
          buttonTitle="Create"
          handlePress={() => router.push("/coupon/create")}
        />
      )}
    />
  );
};

export default Coupons;
