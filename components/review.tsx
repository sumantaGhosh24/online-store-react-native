import {Ionicons} from "@expo/vector-icons";
import {useMutation, useQuery} from "convex/react";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
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

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface ReviewProps {
  _id: string;
  product: {
    _id: string;
    title: string;
    description: string;
  };
  user: {
    _id: string;
    name: string;
    image: string;
  };
  comment: string;
  rating: number;
  _creationTime?: any;
  loading: boolean;
}

const Review = ({
  _id,
  product,
  user,
  comment,
  rating,
  _creationTime,
  loading,
}: ReviewProps) => {
  const currentUser = useQuery(api.users.getUser);

  const isAdmin = currentUser?.role === "admin";

  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteReview = useMutation(api.reviews.deleteReview);

  const handleDeleteReview = async () => {
    if (!isAdmin) {
      return ToastAndroid.showWithGravityAndOffset(
        "You are not authorized to perform this action.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    try {
      setDeleteLoading(true);

      Alert.alert(
        "Delete Review",
        "Are you sure you want to delete this review?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await deleteReview({reviewId: _id as Id<"reviews">});

              ToastAndroid.showWithGravityAndOffset(
                "Review deleted successfully",
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
  };

  return (
    <View className="px-5 py-3 bg-gray-200 dark:bg-gray-800 mx-3 my-2 rounded-md">
      <View className="flex flex-row items-center justify-between gap-3">
        <ShimmerPlaceholder
          width={60}
          height={60}
          shimmerStyle={{borderRadius: 30}}
          visible={!loading}
        >
          <Image
            source={{uri: user.image}}
            className="h-16 w-16 rounded-full"
          />
        </ShimmerPlaceholder>
        <View>
          <ShimmerPlaceholder width={140} height={20} visible={!loading}>
            <Text className="text-xs font-bold dark:text-white">{_id}</Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={140} height={20} visible={!loading}>
            <Text className="text-lg capitalize font-bold dark:text-white">
              {user.name}
            </Text>
            <Text className="text-base dark:text-white">
              Product: {product.title}
            </Text>
          </ShimmerPlaceholder>
        </View>
        {isAdmin && (
          <View>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <TouchableOpacity>
                  <Ionicons
                    name="settings"
                    size={32}
                    color={Colors.background}
                  />
                </TouchableOpacity>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  key="delete"
                  onSelect={() => handleDeleteReview()}
                  disabled={loading || deleteLoading}
                >
                  <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </View>
        )}
      </View>
      <View className="flex-1 gap-1.5 mt-5">
        <ShimmerPlaceholder width={50} height={20} visible={!loading}>
          <Text className="text-base dark:text-white">{comment}</Text>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder width={50} height={20} visible={!loading}>
          <View className="flex flex-row items-center gap-1">
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
          <View className="flex flex-row items-center gap-3 mt-3">
            <Ionicons
              name="refresh-circle"
              size={18}
              color={Colors.background}
            />
            <Text className="text-base dark:text-white">
              Created at: {new Date(_creationTime as any).toLocaleDateString()}
            </Text>
          </View>
        </ShimmerPlaceholder>
      </View>
    </View>
  );
};

export default Review;
