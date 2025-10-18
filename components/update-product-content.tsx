import {useMutation, useQuery} from "convex/react";
import {useState} from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import Editor from "./dom-components/editor";

interface UpdateProductProps {
  id: string;
}

const UpdateProductContent = ({id}: UpdateProductProps) => {
  const product = useQuery(api.products.getProduct, {id: id as Id<"products">});

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const updateProductContent = useMutation(api.products.updateProductContent);

  const handleUpdateProductContent = async () => {
    if (content === "")
      return ToastAndroid.showWithGravityAndOffset(
        "Enter product content!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    try {
      setLoading(true);

      await updateProductContent({
        id: id as Id<"products">,
        content,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Product content updated successfully",
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="mt-5"
      style={{flex: 1}}
    >
      <View style={{flex: 1}}>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Update Product Content
        </Text>
        <View className="bg-white p-3 rounded-md">
          <Markdown>
            {content.length > 0
              ? content
              : product?.content
                ? product?.content
                : "Enter product *content*"}
          </Markdown>
        </View>
        <Editor setContent={setContent} />
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
          onPress={handleUpdateProductContent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Update Product Content
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateProductContent;
