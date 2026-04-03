import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {memo, useCallback} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";

import AnimatedListItem from "../ui/animated-list-item";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface ProductProps {
  _id: string;
  title: string;
  imageUrls: string[];
  description: string;
  category: {
    name: string;
  };
  price: number;
  stock?: number;
  sold?: number;
  loading: boolean;
  index: number;
  reviews: {
    count: number;
    average: number;
  };
}

const HomeProduct = memo(
  ({
    _id,
    title,
    imageUrls,
    description,
    category,
    price,
    stock,
    sold,
    loading,
    index,
    reviews,
  }: ProductProps) => {
    const handleViewProduct = useCallback(() => {
      router.push(`/product/details/${_id}`);
    }, [_id]);

    return (
      <AnimatedListItem index={index}>
        <TouchableOpacity
          onPress={handleViewProduct}
          className="flex-row"
          activeOpacity={0.8}
        >
          <ShimmerPlaceholder
            width={80}
            height={80}
            shimmerStyle={{borderRadius: 16}}
            visible={!loading}
          >
            <Image
              source={{uri: imageUrls?.[0]}}
              className="h-20 w-20 rounded-2xl"
            />
          </ShimmerPlaceholder>
          <View className="flex-1 ml-3 justify-between">
            <ShimmerPlaceholder width={160} height={18} visible={!loading}>
              <Text
                numberOfLines={1}
                className="text-base font-bold text-gray-800 dark:text-white"
              >
                {title}
              </Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={180} height={14} visible={!loading}>
              <Text
                numberOfLines={2}
                className="text-xs text-gray-500 dark:text-white"
              >
                {description}
              </Text>
            </ShimmerPlaceholder>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-xs font-semibold text-primary">
                {category?.name}
              </Text>
              <Text className="text-lg font-bold text-primary">₹{price}</Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-gray-600 dark:text-white">
                Stock: {stock ?? 0}
              </Text>
              <Text className="text-xs text-gray-600 dark:text-white">
                Sold: {sold ?? 0}
              </Text>
              <Text className="text-xs text-yellow-500">
                ⭐ {reviews?.average ?? 0} ({reviews?.count ?? 0})
              </Text>
              {stock !== undefined && stock < 5 && (
                <Text className="text-[10px] text-red-500">Low stock</Text>
              )}
            </View>
          </View>
          <View className="justify-center ml-2">
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </View>
        </TouchableOpacity>
      </AnimatedListItem>
    );
  },
);

HomeProduct.displayName = "HomeProduct";

export default HomeProduct;
