import {Picker} from "@react-native-picker/picker";
import {usePaginatedQuery, useQuery} from "convex/react";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {useColorScheme} from "nativewind";

import HomeProduct from "@/components/products/home-product";
import EmptyState from "@/components/ui/empty-state";
import {PAGINATION_MAX_COUNT} from "@/constant";
import {api} from "@/convex/_generated/api";

const Home = () => {
  const categories = useQuery(api.categories.getCategories);

  const [category, setCategory] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(inputSearch);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputSearch]);

  const {results, status, loadMore, isLoading} = usePaginatedQuery(
    api.products.getPaginatedProducts,
    {categoryId: category, searchTitle: debouncedSearch || undefined},
    {initialNumItems: PAGINATION_MAX_COUNT},
  );

  const hasMore = status === "CanLoadMore";

  const {colorScheme} = useColorScheme();

  return (
    <View className="flex-1">
      <View className="bg-primary p-3">
        <TextInput
          placeholder="Search product"
          value={inputSearch}
          onChangeText={setInputSearch}
          className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-900 dark:placeholder:text-white dark:text-white"
        />
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={{
            backgroundColor: colorScheme === "dark" ? "#111827" : "white",
          }}
        >
          <Picker.Item label="All" value="" />
          {categories?.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>
      </View>
      <FlatList
        data={results}
        renderItem={({item, index}) => (
          <HomeProduct {...item} loading={isLoading} index={index} />
        )}
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
            title="No products found"
            subtitle="Go Profile"
            buttonTitle="Profile"
            handlePress={() => router.push("/profile")}
          />
        )}
      />
    </View>
  );
};

export default Home;
