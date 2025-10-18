import {Ionicons} from "@expo/vector-icons";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import AddProductImage from "@/components/add-product-image";
import RemoveProductImage from "@/components/remove-product-image";
import SegmentedControl from "@/components/segmented-control";
import UpdateProduct from "@/components/update-product";
import UpdateProductContent from "@/components/update-product-content";
import {Colors} from "@/constant/colors";

const UpdateProductScreen = () => {
  const {id} = useLocalSearchParams();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="px-3" style={{flex: 1}}>
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
        <Text className="text-2xl font-bold mb-4 dark:text-white">
          Update Product
        </Text>
        <SegmentedControl
          tabs={[
            "Update Product",
            "Update Content",
            "Add Image",
            "Remove Image",
          ]}
          currentIndex={tabIndex}
          onChange={handleTabsChange}
          segmentedControlBackgroundColor="#fff"
          activeSegmentBackgroundColor="#1D4ED8"
          textColor="#000"
          activeTextColor="#fff"
          paddingVertical={10}
        />
        {tabIndex === 0 && <UpdateProduct id={id as string} />}
        {tabIndex === 1 && <UpdateProductContent id={id as string} />}
        {tabIndex === 2 && <AddProductImage id={id as string} />}
        {tabIndex === 3 && <RemoveProductImage id={id as string} />}
      </View>
    </SafeAreaView>
  );
};

export default UpdateProductScreen;
