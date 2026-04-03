import {Ionicons} from "@expo/vector-icons";
import {useMutation} from "convex/react";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {useCallback, useState} from "react";
import {
  Alert,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import AnimatedListItem from "../ui/animated-list-item";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface CategoryProps {
  _id: string;
  name: string;
  image: any;
  _creationTime?: any;
  loading: boolean;
  index: number;
}

const Category = ({
  _id,
  name,
  image,
  _creationTime,
  loading,
  index,
}: CategoryProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteCategory = useMutation(api.categories.deleteCategory);

  const handleDeleteCategory = useCallback(async () => {
    try {
      setDeleteLoading(true);

      Alert.alert(
        "Delete Category",
        "Are you sure you want to delete this category?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await deleteCategory({id: _id as Id<"categories">});

              ToastAndroid.showWithGravityAndOffset(
                "Category deleted successfully",
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
  }, [_id, deleteCategory]);

  return (
    <AnimatedListItem index={index}>
      <View className="flex-row items-center gap-3 w-full">
        <ShimmerPlaceholder
          width={60}
          height={60}
          shimmerStyle={{borderRadius: 30}}
          visible={!loading}
        >
          <Image source={{uri: image}} className="h-14 w-14 rounded-full" />
        </ShimmerPlaceholder>
        <View className="flex-1 gap-1">
          <ShimmerPlaceholder width={120} height={14} visible={!loading}>
            <Text className="text-xs text-gray-500 dark:text-white">{_id}</Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder width={160} height={18} visible={!loading}>
            <Text className="text-base font-semibold dark:text-white capitalize">
              {name}
            </Text>
          </ShimmerPlaceholder>
          <View className="flex-row items-center gap-2 mt-1">
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <ShimmerPlaceholder width={140} height={14} visible={!loading}>
              <Text className="text-xs text-gray-500 dark:text-white">
                {new Date(_creationTime as any).toLocaleDateString()}
              </Text>
            </ShimmerPlaceholder>
          </View>
        </View>
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            className="p-1"
            disabled={loading || deleteLoading}
            onPress={() => router.push(`/category/update/${_id}`)}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={Colors.background}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1"
            disabled={loading || deleteLoading}
            onPress={handleDeleteCategory}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#ef4444"
            />
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedListItem>
  );
};

export default Category;
