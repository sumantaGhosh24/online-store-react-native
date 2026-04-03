import {Ionicons} from "@expo/vector-icons";
import {useMutation, useQuery} from "convex/react";
import {useCallback, useState} from "react";
import {
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import AnimatedListItem from "../ui/animated-list-item";

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
  index: number;
}

const Review = ({
  _id,
  product,
  user,
  comment,
  rating,
  _creationTime,
  index,
}: ReviewProps) => {
  const currentUser = useQuery(api.users.getUser);

  const isAdmin = currentUser?.role === "admin";

  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteReview = useMutation(api.reviews.deleteReview);

  const handleDeleteReview = useCallback(async () => {
    if (!isAdmin) {
      return ToastAndroid.showWithGravityAndOffset(
        "You are not authorized to perform this action.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
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
  }, [_id, deleteReview, isAdmin]);

  return (
    <AnimatedListItem index={index}>
      <View>
        <View className="flex flex-row items-center justify-between gap-3 w-full">
          <Image
            source={{uri: user.image}}
            className="h-16 w-16 rounded-full"
          />
          <View>
            <Text className="text-lg capitalize font-bold dark:text-white">
              {user.name}
            </Text>
            <Text className="text-base dark:text-white">
              Product: {product.title.substring(0, 25)}...
            </Text>
          </View>
          {isAdmin && (
            <View>
              <TouchableOpacity
                onPress={() => handleDeleteReview()}
                disabled={deleteLoading}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name="trash-outline"
                  size={28}
                  color="#ef4444"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex-1 gap-1.5 mt-5">
          <Text className="text-base dark:text-white">{comment}</Text>
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
        </View>
      </View>
    </AnimatedListItem>
  );
};

export default Review;
