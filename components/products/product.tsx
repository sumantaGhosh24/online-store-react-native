import {Ionicons} from "@expo/vector-icons";
import {useMutation} from "convex/react";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {memo, useCallback, useState} from "react";
import {
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";
import * as DropdownMenu from "zeego/dropdown-menu";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import AnimatedListItem from "../ui/animated-list-item";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export interface ProductProps {
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

const Product = memo(
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
    const [deleteLoading, setDeleteLoading] = useState(false);

    const deleteProduct = useMutation(api.products.deleteProduct);

    const handleDeleteProduct = useCallback(async () => {
      try {
        setDeleteLoading(true);

        Alert.alert(
          "Delete Product",
          "Are you sure you want to delete this product?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: async () => {
                await deleteProduct({id: _id as Id<"products">});

                ToastAndroid.showWithGravityAndOffset(
                  "Product deleted successfully",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              },
              style: "destructive",
            },
          ],
        );
      } catch (error: any) {
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } finally {
        setDeleteLoading(false);
      }
    }, [_id, deleteProduct]);

    return (
      <AnimatedListItem index={index}>
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
        <View>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <TouchableOpacity>
                <Ionicons name="settings" size={32} color={Colors.background} />
              </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                key="update"
                onSelect={() => router.push(`/product/update/${_id}`)}
                disabled={loading || deleteLoading}
              >
                <DropdownMenu.ItemTitle>Update</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                key="delete"
                onSelect={() => handleDeleteProduct()}
                disabled={loading || deleteLoading}
              >
                <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </View>
      </AnimatedListItem>
    );
  },
);

Product.displayName = "Product";

export default Product;
