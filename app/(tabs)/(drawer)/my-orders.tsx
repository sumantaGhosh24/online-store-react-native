import {usePaginatedQuery, useQuery} from "convex/react";
import {router} from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

import Order from "@/components/orders/order";
import EmptyState from "@/components/ui/empty-state";
import {PAGINATION_MAX_COUNT} from "@/constant";
import {api} from "@/convex/_generated/api";

const MyOrders = () => {
  const user = useQuery(api.users.getUser);

  const {results, status, loadMore, isLoading} = usePaginatedQuery(
    api.orders.getPaginatedOrders,
    {userId: user?._id},
    {initialNumItems: PAGINATION_MAX_COUNT}
  );

  const hasMore = status === "CanLoadMore";

  return (
    <FlatList
      data={results}
      renderItem={({item, index}) => (
        <Order {...item} loading={isLoading} index={index} />
      )}
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
          title="No orders found"
          subtitle="Go to cart"
          buttonTitle="Find"
          handlePress={() => router.push("/cart")}
        />
      )}
    />
  );
};

export default MyOrders;
