import {zodResolver} from "@hookform/resolvers/zod";
import {Picker} from "@react-native-picker/picker";
import {useMutation, useQuery} from "convex/react";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import {z} from "zod";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const updateProductSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  price: z.string().min(1),
  stock: z.string().min(1),
  sold: z.string().min(1),
});
type UpdateProductForm = z.infer<typeof updateProductSchema>;

interface UpdateProductProps {
  id: string;
}

const UpdateProduct = ({id}: UpdateProductProps) => {
  const product = useQuery(api.products.getProduct, {id: id as Id<"products">});

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductSchema),
    values: {
      title: product?.title || "",
      description: product?.description || "",
      price: String(product?.price) || "0",
      stock: String(product?.stock) || "0",
      sold: String(product?.sold) || "0",
    },
  });

  const [category, setCategory] = useState(product?.category?._id);
  const [loading, setLoading] = useState(false);

  const categories = useQuery(api.categories.getCategories);

  const updateProduct = useMutation(api.products.updateProduct);

  const onSubmit = async (data: UpdateProductForm) => {
    if (category === "")
      return ToastAndroid.showWithGravityAndOffset(
        "Select a category first!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    if (isNaN(parseInt(data.price)))
      return ToastAndroid.showWithGravityAndOffset(
        "Price must be a number",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    if (isNaN(parseInt(data.stock)))
      return ToastAndroid.showWithGravityAndOffset(
        "Stock must be a number",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    if (isNaN(parseInt(data.sold)))
      return ToastAndroid.showWithGravityAndOffset(
        "Sold must be a number",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    try {
      setLoading(true);

      await updateProduct({
        id: id as Id<"products">,
        title: data.title,
        description: data.description,
        category: category as Id<"categories">,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        sold: parseInt(data.sold),
      });

      ToastAndroid.showWithGravityAndOffset(
        "Product updated successfully",
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
      className="px-3 mt-5"
    >
      <ScrollView>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
          Update Product
        </Text>
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Product title
        </Text>
        <Controller
          control={control}
          name="title"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product title"
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.title && (
          <Text className="text-red-500 mb-2">{errors.title.message}</Text>
        )}
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Product description
        </Text>
        <Controller
          control={control}
          name="description"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white h-[150px]"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product description"
              keyboardType="default"
              autoCapitalize="none"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          )}
        />
        {errors.description && (
          <Text className="text-red-500 mb-2">
            {errors.description.message}
          </Text>
        )}
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Product price
        </Text>
        <Controller
          control={control}
          name="price"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product price"
              keyboardType="number-pad"
            />
          )}
        />
        {errors.price && (
          <Text className="text-red-500 mb-2">{errors.price.message}</Text>
        )}
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Product stock
        </Text>
        <Controller
          control={control}
          name="stock"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product stock"
              keyboardType="number-pad"
            />
          )}
        />
        {errors.stock && (
          <Text className="text-red-500 mb-2">{errors.stock.message}</Text>
        )}
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Product sold
        </Text>
        <Controller
          control={control}
          name="sold"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white placeholder:text-black dark:bg-gray-700 dark:border-0 dark:placeholder:text-white dark:text-white"
              value={String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter product sold"
              keyboardType="number-pad"
            />
          )}
        />
        {errors.sold && (
          <Text className="text-red-500 mb-2">{errors.sold.message}</Text>
        )}
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="All" value="" />
          {categories?.map((cat) => (
            <Picker.Item
              label={cat.name}
              value={cat._id}
              key={cat._id}
              enabled={cat._id !== category}
            />
          ))}
        </Picker>
        <TouchableOpacity
          className="bg-primary rounded-full py-3 items-center my-5 disabled:bg-blue-300"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-medium text-white">
              Update Product
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProduct;
