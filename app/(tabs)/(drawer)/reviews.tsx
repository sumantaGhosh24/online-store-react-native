import {Picker} from "@react-native-picker/picker";
import {usePaginatedQuery, useQuery} from "convex/react";
import {router} from "expo-router";
import {useState} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useColorScheme} from "nativewind";

import Review from "@/components/reviews/review";
import EmptyState from "@/components/ui/empty-state";
import {PAGINATION_MAX_COUNT} from "@/constant";
import {api} from "@/convex/_generated/api";

const Reviews = () => {
  const products = useQuery(api.products.getProducts);

  const users = useQuery(api.users.getUsers);

  const [product, setProduct] = useState("");
  const [user, setUser] = useState("");

  const {results, status, loadMore, isLoading} = usePaginatedQuery(
    api.reviews.getPaginatedReviews,
    {productId: product, userId: user},
    {initialNumItems: PAGINATION_MAX_COUNT},
  );

  const hasMore = status === "CanLoadMore";

  const {colorScheme} = useColorScheme();

  return (
    <View className="flex-1">
      <View className="bg-primary p-3">
        <Picker
          selectedValue={product}
          onValueChange={(itemValue) => setProduct(itemValue)}
          style={{
            backgroundColor: colorScheme === "dark" ? "#111827" : "white",
            marginBottom: 5,
          }}
        >
          <Picker.Item label="All" value="" />
          {products?.map((pro) => (
            <Picker.Item
              label={pro.title.substring(0, 20)}
              value={pro._id}
              key={pro._id}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={user}
          onValueChange={(itemValue) => setUser(itemValue)}
          style={{
            backgroundColor: colorScheme === "dark" ? "#111827" : "white",
          }}
        >
          <Picker.Item label="All" value="" />
          {users?.map((us) => (
            <Picker.Item label={us.name} value={us._id} key={us._id} />
          ))}
        </Picker>
      </View>
      <FlatList
        data={results}
        renderItem={({item, index}) => <Review {...item} index={index} />}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
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
                <Text className="text-lg font-medium text-white">
                  Load More
                </Text>
              )}
            </TouchableOpacity>
          )
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No reviews found"
            subtitle="Try other filters or add products first"
            buttonTitle="Products"
            handlePress={() => router.push("/products")}
          />
        )}
      />
    </View>
  );
};

export default Reviews;
