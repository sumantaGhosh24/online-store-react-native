import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "convex/react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {useState} from "react";
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

import AddProductReview from "@/components/add-product-review";
import ProductReviews from "@/components/product-reviews";
import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

const ProductDetails = () => {
  const {id} = useLocalSearchParams();

  const [activeImage, setActiveImage] = useState(0);

  const product = useQuery(api.products.getProduct, {id: id as Id<"products">});

  const {addProduct} = useCartStore();

  const shareProduct = () => {
    Alert.alert("Share product");
  };

  const likeProduct = () => {
    Alert.alert("Like product");
  };

  const handleAddToCart = () => {
    addProduct(id as Id<"products">);

    ToastAndroid.showWithGravityAndOffset(
      "Product added to cart",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      100
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Product Details",
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          headerRight: () => (
            <View className="flex-row items-center justify-center gap-3">
              <TouchableOpacity
                className="items-center justify-center"
                onPress={shareProduct}
              >
                <Ionicons name="share-outline" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center justify-center"
                onPress={likeProduct}
              >
                <Ionicons name="heart-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity
              className="items-center justify-center mr-5"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <ScrollView>
          <Image
            source={{uri: product?.imageUrls[activeImage]}}
            className="h-[250px] w-full rounded mb-4"
            resizeMode="cover"
          />
          <View className="flex flex-row items-center justify-center gap-3 mb-4">
            {product?.imageUrls.map((image) => (
              <TouchableOpacity
                className={`h-12 w-12 rounded-full ${
                  product?.imageUrls.indexOf(image) === activeImage
                    ? "border-2 border-primary h-14 w-14"
                    : ""
                }`}
                key={image}
                onPress={() =>
                  setActiveImage(product?.imageUrls.indexOf(image))
                }
              >
                <Image
                  source={{uri: image}}
                  className="h-12 w-12 rounded-full"
                  key={image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
          <View className="px-3">
            <Text className="text-2xl capitalize font-bold mb-3 dark:text-white">
              {product?.title}
            </Text>
            <Text className="text-lg mb-3 dark:text-white">
              {product?.description}
            </Text>
            {product?.content && (
              <View className="bg-white p-3 rounded-md mb-3">
                <Markdown>{product?.content}</Markdown>
              </View>
            )}
            <View className="flex flex-row items-center gap-3 mb-3 flex-wrap">
              <Text className="bg-primary text-white py-1.5 px-2 rounded-md">
                Price: ₹{product?.price}
              </Text>
              <Text className="bg-primary text-white py-1.5 px-2 rounded-md">
                Stock: {product?.stock}
              </Text>
              <Text className="bg-primary text-white py-1.5 px-2 rounded-md">
                Sold: {product?.sold}
              </Text>
              <View className="flex-row items-center gap-3 bg-primary py-1.5 px-2 rounded-md">
                <Image
                  source={{uri: product?.category?.image}}
                  className="w-6 h-6 rounded-full"
                />
                <Text className="text-white">{product?.category?.name}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3 mb-3">
              <Image
                source={{uri: product?.user?.image}}
                className="w-12 h-12 rounded-full"
              />
              <View>
                <View className="flex items-center flex-row">
                  <Text className="dark:text-white">Created by </Text>
                  <Text className="font-bold dark:text-white">
                    {product?.user?.name}
                  </Text>
                </View>
                <View className="flex items-center flex-row">
                  <Text className="dark:text-white">Created since </Text>
                  <Text className="font-bold dark:text-white">
                    {new Date(
                      product?._creationTime as any
                    ).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-full py-3 mb-4 disabled:bg-blue-300 flex flex-row items-center justify-center gap-3 mx-24"
              onPress={handleAddToCart}
            >
              <Ionicons name="cart" size={22} color="#fff" />
              <Text className="text-lg font-medium text-white">
                Add to Cart
              </Text>
            </TouchableOpacity>
            <AddProductReview id={id as Id<"products">} />
            <ProductReviews id={id as Id<"products">} />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ProductDetails;
