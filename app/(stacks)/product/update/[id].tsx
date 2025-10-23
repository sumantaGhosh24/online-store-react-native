import {useLocalSearchParams} from "expo-router";
import {useCallback, useState} from "react";
import {View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import AddProductImage from "@/components/products/add-product-image";
import RemoveProductImage from "@/components/products/remove-product-image";
import UpdateProduct from "@/components/products/update-product";
import UpdateProductContent from "@/components/products/update-product-content";
import SegmentedControl from "@/components/ui/segmented-control";

const UpdateProductScreen = () => {
  const {id} = useLocalSearchParams();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = useCallback((index: number) => {
    setTabIndex(index);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="px-3" style={{flex: 1}}>
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
