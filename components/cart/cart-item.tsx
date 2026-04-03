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
      100,
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
      100,
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
      100,
    );
  };

  return (
    <View className="flex-row bg-white dark:bg-gray-800 p-3 rounded-md mb-3">
      <Image
        source={{uri: product?.imageUrls?.[0]}}
        className="w-24 h-24 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 ml-3 justify-between">
        <Text
          numberOfLines={1}
          className="text-lg capitalize font-bold dark:text-white"
        >
          {product?.title}
        </Text>
        <Text
          numberOfLines={2}
          className="text-xs text-gray-500 dark:text-gray-300 mt-1"
        >
          {product?.description}
        </Text>
        <Text className="text-lg font-bold text-primary mt-1">
          ₹{product?.price! * quantity}{" "}
          <Text className="text-xs">(₹{product?.price} each)</Text>
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
            <TouchableOpacity onPress={() => handleReduceFromCart()}>
              <Ionicons
                name="remove"
                size={18}
                color={colorSchema === "dark" ? "#fff" : "#333"}
              />
            </TouchableOpacity>
            <Text className="mx-3 font-semibold dark:text-white">
              {quantity}
            </Text>
            <TouchableOpacity onPress={() => handleAddToCart()}>
              <Ionicons
                name="add"
                size={18}
                color={colorSchema === "dark" ? "#fff" : "#333"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handleRemoveFromCart()}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
            <Text className="text-red-500 text-xs">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

CartItem.displayName = "CartItem";

export default CartItem;
