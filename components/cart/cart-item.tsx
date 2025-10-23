import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "convex/react";
import {memo} from "react";
import {
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

interface Product {
  _id: Id<"products">;
  quantity: number;
}

const CartItem = memo(({_id, quantity}: Product) => {
  const product = useQuery(api.products.getProduct, {id: _id});

  const {addProduct, removeProduct, reduceProduct, removeCoupon} =
    useCartStore();

  const colorSchema = useColorScheme();

  const handleAddToCart = () => {
    addProduct(_id);
    removeCoupon();

    ToastAndroid.showWithGravityAndOffset(
      "Product added to cart",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      100
    );
  };

  const handleRemoveFromCart = () => {
    removeProduct(_id);
    removeCoupon();

    ToastAndroid.showWithGravityAndOffset(
      "Product removed from cart",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      100
    );
  };

  const handleReduceFromCart = () => {
    if (quantity === 1) {
      handleRemoveFromCart();
      return;
    }
    reduceProduct(_id);
    removeCoupon();

    ToastAndroid.showWithGravityAndOffset(
      "Product reduced from cart",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      100
    );
  };

  return (
    <View className="flex-row items-center p-3 mb-3 bg-white dark:bg-gray-800">
      <View className="flex-row items-center gap-2">
        <View className="flex-col">
          <Image
            source={{uri: product?.imageUrls[0]}}
            className="w-20 h-20 rounded-md mr-4"
            resizeMode="cover"
          />
          <Text className="font-bold text-lg my-2 dark:text-white">
            ₹{product?.price! * quantity}
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => handleReduceFromCart()}
              className="border border-gray-300 rounded-full p-1 dark:border-white"
            >
              <Ionicons
                name="remove"
                size={18}
                color={colorSchema === "dark" ? "#fff" : "#333"}
              />
            </TouchableOpacity>
            <Text className="mx-2 font-semibold text-base dark:text-white">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleAddToCart()}
              className="border border-gray-300 rounded-full p-1 dark:border-white"
            >
              <Ionicons
                name="add"
                size={18}
                color={colorSchema === "dark" ? "#fff" : "#333"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 flex-col justify-between">
          <Text
            className="font-bold text-base mb-1 dark:text-white"
            numberOfLines={1}
          >
            {product?.title}
          </Text>
          <Text className="font-bold text-xs mb-1 dark:text-white">
            {product?.description}
          </Text>
          <View className="flex-1" />
          <TouchableOpacity
            onPress={() => handleRemoveFromCart()}
            className="border border-gray-300 rounded-full p-1 w-20 justify-center items-center dark:border-white"
          >
            <Text className="dark:text-white">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

CartItem.displayName = "CartItem";

export default CartItem;
