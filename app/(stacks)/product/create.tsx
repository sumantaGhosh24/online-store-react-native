import {Ionicons} from "@expo/vector-icons";
import {zodResolver} from "@hookform/resolvers/zod";
import {Picker} from "@react-native-picker/picker";
import {useMutation, useQuery} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {router, Stack} from "expo-router";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {z} from "zod";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const createProductSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  price: z.string().min(1),
  stock: z.string().min(1),
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
  const [loading, setLoading] = useState(false);

  const categories = useQuery(api.categories.getCategories);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createProduct = useMutation(api.products.createProduct);

  const selectImage = async (source: "camera" | "library") => {
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
  };

  const onSubmit = async (data: CreateProductForm) => {
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

    try {
      setLoading(true);

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
      style={{flex: 1}}
    >
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          headerLeft: () => (
            <TouchableOpacity
              className="items-center justify-center mr-5"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView>
        <Text className="text-2xl font-bold mb-2 dark:text-white">
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
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">Open Media</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary rounded-full p-3 items-center mb-4 disabled:bg-blue-300 w-1/3"
            onPress={() => selectImage("camera")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-medium text-white">
                Open Camera
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
              value={value}
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
              value={value}
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
          Product category
        </Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="All" value="" />
          {categories?.map((category) => (
            <Picker.Item
              label={category.name}
              value={category._id}
              key={category._id}
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
              Create Product
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateProduct;
