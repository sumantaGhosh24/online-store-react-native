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
  _creationTime?: any;
  loading: boolean;
  index: number;
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
    _creationTime,
    loading,
    index,
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
                  50
                );
              },
              style: "destructive",
            },
          ]
        );
      } catch (error: any) {
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } finally {
        setDeleteLoading(false);
      }
    }, [_id, deleteProduct]);

    return (
      <AnimatedListItem index={index}>
        <ShimmerPlaceholder
          width={60}
          height={60}
          shimmerStyle={{borderRadius: 30}}
          visible={!loading}
        >
          <Image
            source={{uri: imageUrls[0]}}
            className="h-16 w-16 rounded-full"
          />
        </ShimmerPlaceholder>
        <View className="flex-1 gap-1.5">
          <ShimmerPlaceholder width={140} height={20} visible={!loading}>
            <Text className="text-xs font-bold dark:text-white">{_id}</Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={140} height={20} visible={!loading}>
            <Text className="text-lg capitalize font-bold dark:text-white">
              {title}
            </Text>
            <Text className="text-base font-bold dark:text-white">
              {description}
            </Text>
          </ShimmerPlaceholder>
          <View className="flex flex-row items-center gap-3">
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold">{category.name}</Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold">₹ {price}</Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold">{stock}</Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold">{sold}</Text>
            </ShimmerPlaceholder>
          </View>
          <ShimmerPlaceholder
            width={75}
            height={20}
            style={{marginBottom: 5}}
            visible={!loading}
          >
            <View className="flex flex-row items-center gap-1">
              <Ionicons
                name="refresh-circle"
                size={14}
                color={Colors.background}
              />
              <Text className="text-xs dark:text-white">
                Created at:{" "}
                {new Date(_creationTime as any).toLocaleDateString()}
              </Text>
            </View>
          </ShimmerPlaceholder>
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
                key="view"
                onSelect={() => router.push(`/product/details/${_id}`)}
                disabled={loading || deleteLoading}
              >
                <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
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
  }
);

Product.displayName = "Product";

export default Product;
