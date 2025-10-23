import {zodResolver} from "@hookform/resolvers/zod";
import {Picker} from "@react-native-picker/picker";
import {useMutation, useQuery} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {useCallback, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {z} from "zod";

import AnimatedButton from "@/components/ui/animated-button";
import AnimatedInput from "@/components/ui/animated-input";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const createProductSchema = z.object({
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
});
type CreateProductForm = z.infer<typeof createProductSchema>;

const CreateProduct = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      stock: "0",
    },
  });

  const [image, setImage] = useState<any>();
  const [category, setCategory] = useState("");
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

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createProduct = useMutation(api.products.createProduct);

  const selectImage = useCallback(async (source: "camera" | "library") => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      mediaTypes: ["images"],
    };

    let result;

    if (source === "camera") {
      const {granted} = await ImagePicker.requestCameraPermissionsAsync();

      if (!granted) {
        ToastAndroid.showWithGravityAndOffset(
          "Permission denied",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        ToastAndroid.showWithGravityAndOffset(
          "Permission denied",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        return;
      }

      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setImage(result.assets[0] as any);
    }
  }, []);

  const onSubmit = useCallback(
    async (data: CreateProductForm) => {
      if (!image)
        return ToastAndroid.showWithGravityAndOffset(
          "Select an image first!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
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
        const url = await generateUploadUrl();

        const response = await fetch(image.uri);
        const blob = await response.blob();

        const result = await fetch(url, {
          method: "POST",
          headers: image.type ? {"Content-Type": `${image.mimeType}`} : {},
          body: blob,
        });
        const {storageId} = await result.json();

        await createProduct({
          title: data.title,
          description: data.description,
          image: storageId,
          category: category as Id<"categories">,
          price: parseInt(data.price),
          stock: parseInt(data.stock),
        });

        setLoading("success");

        reset();
        setImage(null);
        setCategory("");

        ToastAndroid.showWithGravityAndOffset(
          "Product created successfully",
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
    [image, category, generateUploadUrl, createProduct, reset]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="px-3 mt-5"
      style={{flex: 1}}
    >
      <ScrollView>
        <Text className="text-2xl font-bold mb-5 dark:text-white">
          Create Product
        </Text>
        {image && (
          <View>
            <Image
              source={{uri: image?.uri}}
              className="h-[250px] w-full rounded mb-4"
            />
          </View>
        )}
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("library")}
            disabled={loading === "loading"}
          >
            {loading === "loading" ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">Open Media</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("camera")}
            disabled={loading === "loading"}
          >
            {loading === "loading" ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">
                Open Camera
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
        <Text className="text-lg font-bold mt-3 mb-1.5 dark:text-white">
          Product category
        </Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="All" value="" />
          {categoryItems}
        </Picker>
        <AnimatedButton
          title="Create Product"
          state={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateProduct;
