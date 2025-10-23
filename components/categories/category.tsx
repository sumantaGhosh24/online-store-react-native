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
import * as DropdownMenu from "zeego/dropdown-menu";

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
  }, [_id, deleteCategory]);

  return (
    <AnimatedListItem index={index}>
      <ShimmerPlaceholder
        width={60}
        height={60}
        shimmerStyle={{borderRadius: 30}}
        visible={!loading}
      >
        <Image source={{uri: image}} className="h-16 w-16 rounded-full" />
      </ShimmerPlaceholder>
      <View className="flex-1 gap-1.5">
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-xs font-bold dark:text-white">{_id}</Text>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder width={140} height={20} visible={!loading}>
          <Text className="text-base capitalize font-bold dark:text-white">
            {name}
          </Text>
        </ShimmerPlaceholder>
        <ShimmerPlaceholder
          width={75}
          height={20}
          style={{marginBottom: 5}}
          visible={!loading}
        >
          <View className="flex flex-row items-center gap-3">
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
              onSelect={() => router.push(`/category/update/${_id}`)}
              disabled={loading || deleteLoading}
            >
              <DropdownMenu.ItemTitle>Update</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="delete"
              onSelect={() => handleDeleteCategory()}
              disabled={loading || deleteLoading}
            >
              <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </AnimatedListItem>
  );
};

export default Category;
