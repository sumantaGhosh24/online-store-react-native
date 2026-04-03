import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "convex/react";
import {Stack, useLocalSearchParams} from "expo-router";
import {useCallback, useState} from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import AddProductReview from "@/components/reviews/add-product-review";
import ProductReviews from "@/components/reviews/product-reviews";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

const ProductDetails = () => {
  const {id} = useLocalSearchParams();

  const [activeImage, setActiveImage] = useState(0);

  const product = useQuery(api.products.getProduct, {id: id as Id<"products">});

  const {addProduct} = useCartStore();

  const shareProduct = useCallback(() => {
    Alert.alert("Share product");
  }, []);

  const likeProduct = useCallback(() => {
    Alert.alert("Like product");
  }, []);

  const handleAddToCart = useCallback(() => {
    addProduct(id as Id<"products">);

    ToastAndroid.showWithGravityAndOffset(
      "Product added to cart",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      100,
    );
  }, [addProduct, id]);

  return (
    <>
      <Stack.Screen options={{title: product?.title}} />
      <ScrollView>
        <View className="relative">
          <Image
            source={{uri: product?.imageUrls?.[activeImage]}}
            className="h-[280px] w-full"
          />
          <View className="absolute top-4 right-4 flex-row gap-3">
            <TouchableOpacity onPress={shareProduct}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={likeProduct}>
              <Ionicons name="heart-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal className="px-3 mt-3">
          {product?.imageUrls?.map((img, i) => (
            <TouchableOpacity key={img} onPress={() => setActiveImage(i)}>
              <Image
                source={{uri: img}}
                className={`w-16 h-16 rounded-xl mr-2 ${
                  activeImage === i ? "border-2 border-blue-500" : ""
                }`}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="p-4">
          <Text className="text-xl font-bold dark:text-white">
            {product?.title}
          </Text>
          <Text className="text-yellow-500 mt-1">
            ⭐ {product?.reviews?.average ?? 0} ({product?.reviews?.count ?? 0})
          </Text>
          <Text className="text-2xl font-bold text-green-600 mt-2">
            ₹{product?.price}
          </Text>
          <Text className="mt-2 dark:text-white">{product?.description}</Text>
          <View className="bg-white px-1 rounded my-2">
            <Markdown>{product?.content}</Markdown>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-3">
            <Text className="bg-primary text-white px-2 py-1 rounded uppercase">
              {product?.category?.name}
            </Text>
            <Text className="bg-purple-500 text-white px-2 py-1 rounded">
              Stock: {product?.stock ?? 0}
            </Text>
            <Text className="bg-orange-500 text-white px-2 py-1 rounded">
              Sold: {product?.sold ?? 0}
            </Text>
          </View>
          <View className="flex-row items-center mt-4 gap-3">
            <Image
              source={{uri: product?.user?.image}}
              className="w-12 h-12 rounded-full"
            />
            <View>
              <Text className="dark:text-white">By {product?.user?.name}</Text>
              <Text className="text-xs text-gray-500 dark:text-white">
                {new Date(product?._creationTime as any).toDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-blue-600 py-3 rounded-xl mt-4 flex-row justify-center"
          >
            <Ionicons name="cart" size={20} color="#fff" />
            <Text className="text-white ml-2">Add to Cart</Text>
          </TouchableOpacity>
          <AddProductReview id={id as Id<"products">} />
          <ProductReviews id={id as Id<"products">} />
        </View>
      </ScrollView>
    </>
  );
};

export default ProductDetails;
