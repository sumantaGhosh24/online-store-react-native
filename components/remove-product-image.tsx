import {FontAwesome} from "@expo/vector-icons";
import {useMutation, useQuery} from "convex/react";
import {useState} from "react";
import {ImageBackground, Text, ToastAndroid, View} from "react-native";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const RemoveProductImage = ({id}: {id: string}) => {
  const product = useQuery(api.products.getProduct, {id: id as Id<"products">});

  const removeProductImage = useMutation(api.products.removeProductImage);

  const [loading, setLoading] = useState(false);

  const handleDeleteProductImage = async (imageId: Id<"_storage">) => {
    if (!imageId) return;

    try {
      setLoading(true);

      await removeProductImage({
        productId: id as Id<"products">,
        imageIdToRemove: imageId,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Product image removed successfully",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text className="text-2xl font-bold mb-2 dark:text-white">
        Remove Product Image
      </Text>
      <View className="flex flex-row items-center flex-wrap gap-3 mt-3">
        {product?.images?.map((img, i) => (
          <ImageBackground
            source={{uri: product?.imageUrls[i]}}
            className="relative h-24 w-24 rounded"
            key={i}
          >
            <FontAwesome
              name="trash"
              size={24}
              color="#e10a11"
              onPress={() => handleDeleteProductImage(img)}
              disabled={loading}
            />
          </ImageBackground>
        ))}
      </View>
    </View>
  );
};

export default RemoveProductImage;
