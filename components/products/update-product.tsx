import {zodResolver} from "@hookform/resolvers/zod";
import {Picker} from "@react-native-picker/picker";
import {useMutation, useQuery} from "convex/react";
import {useCallback, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
} from "react-native";
import {z} from "zod";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import AnimatedButton from "../ui/animated-button";
import AnimatedInput from "../ui/animated-input";

const updateProductSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  price: z
    .string()
    .min(1)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num);
    }, "Price must be a number"),
  stock: z
    .string()
    .min(1)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num);
    }, "Stock must be a number"),
  sold: z
    .string()
    .min(1)
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num);
    }, "Sold must be a number"),
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
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const categories = useQuery(api.categories.getCategories);

  const categoryItems = useMemo(() => {
    return categories?.map((category) => (
      <Picker.Item
        label={category.name}
        value={category._id}
        key={category._id}
      />
    ));
  }, [categories]);

  const updateProduct = useMutation(api.products.updateProduct);

  const onSubmit = useCallback(
    async (data: UpdateProductForm) => {
      if (category === "")
        return ToastAndroid.showWithGravityAndOffset(
          "Select a category first!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

      setLoading("loading");
      try {
        await updateProduct({
          id: id as Id<"products">,
          title: data.title,
          description: data.description,
          category: category as Id<"categories">,
          price: parseInt(data.price),
          stock: parseInt(data.stock),
          sold: parseInt(data.sold),
        });

        setLoading("success");

        ToastAndroid.showWithGravityAndOffset(
          "Product updated successfully",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      } catch (error: any) {
        setLoading("error");
        ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100
        );
      }
    },
    [category, id, updateProduct]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="px-3 mt-5"
    >
      <ScrollView>
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Update Product
        </Text>
        <AnimatedInput
          control={control}
          name="title"
          label="Product Title"
          keyboardType="default"
          autoCapitalize="none"
          error={errors.title?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="description"
          label="Product Description"
          keyboardType="default"
          autoCapitalize="none"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          error={errors.title?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="price"
          label="Product Price"
          keyboardType="numeric"
          autoCapitalize="none"
          error={errors.price?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="stock"
          label="Product Stock"
          keyboardType="numeric"
          autoCapitalize="none"
          error={errors.stock?.message}
          setLoading={setLoading}
        />
        <AnimatedInput
          control={control}
          name="sold"
          label="Product Sold"
          keyboardType="numeric"
          autoCapitalize="none"
          error={errors.sold?.message}
          setLoading={setLoading}
        />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="All" value="" />
          {categoryItems}
        </Picker>
        <AnimatedButton
          title="Update Product"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProduct;
