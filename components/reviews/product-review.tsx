import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {memo} from "react";
import {Image, Text, View} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";

import {Colors} from "@/constant/colors";

import AnimatedListItem from "../ui/animated-list-item";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface ReviewProps {
  user: {
    _id: string;
    name: string;
    image: string;
    username: string;
  };
  comment: string;
  rating: number;
  _creationTime?: any;
  loading: boolean;
  index: number;
}

const ProductReview = memo(
  ({user, comment, rating, _creationTime, loading, index}: ReviewProps) => {
    return (
      <AnimatedListItem index={index}>
        <View className="w-full">
          <View className="flex flex-row items-center gap-4 mb-3">
            <ShimmerPlaceholder
              width={60}
              height={60}
              shimmerStyle={{borderRadius: 30}}
              visible={!loading}
            >
              <Image
                source={{uri: user.image}}
                className="h-12 w-12 rounded-full"
              />
            </ShimmerPlaceholder>
            <View>
              <ShimmerPlaceholder width={140} height={20} visible={!loading}>
                <Text className="text-lg capitalize font-bold dark:text-white">
                  {user.name}
                </Text>
                <Text className="text-md dark:text-white">
                  @{user.username}
                </Text>
              </ShimmerPlaceholder>
            </View>
          </View>
          <View className="flex-1 gap-1.5">
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <Text className="text-base dark:text-white">{comment}</Text>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder width={50} height={20} visible={!loading}>
              <View className="flex flex-row items-center gap1.5">
                {Array.from({length: 5}, (_, i) => i + 1).map((star, index) => (
                  <Ionicons
                    key={index}
                    name={rating >= index ? "star" : "star-outline"}
                    size={18}
                    color={rating >= index ? "orange" : "gray"}
                  />
                ))}
              </View>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder
              width={75}
              height={20}
              style={{marginBottom: 5}}
              visible={!loading}
            >
              <View className="flex flex-row items-center gap-1 mt-3">
                <Ionicons
                  name="time-outline"
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
        </View>
      </AnimatedListItem>
    );
  },
);

ProductReview.displayName = "ProductReview";

export default ProductReview;
