import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {memo, useCallback} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";
import * as DropdownMenu from "zeego/dropdown-menu";

import {Colors} from "@/constant/colors";

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
  _creationTime?: any;
  loading: boolean;
  index: number;
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
    _creationTime,
    loading,
    index,
  }: ProductProps) => {
    const handleViewProduct = useCallback(() => {
      router.push(`/product/details/${_id}`);
    }, [_id]);

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
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={140} height={20} visible={!loading}>
            <Text className="text-base font-bold dark:text-white">
              {description}
            </Text>
          </ShimmerPlaceholder>
          <View className="flex flex-row items-center gap-3">
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold text-xs">
                {category.name}
              </Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold text-xs">
                ₹ {price}
              </Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold text-xs">{stock}</Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="dark:text-white font-bold text-xs">{sold}</Text>
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
                <Ionicons name="eye" size={32} color={Colors.background} />
              </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                key="view"
                onSelect={handleViewProduct}
                disabled={loading}
              >
                <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </View>
      </AnimatedListItem>
    );
  }
);

HomeProduct.displayName = "HomeProduct";

export default HomeProduct;
