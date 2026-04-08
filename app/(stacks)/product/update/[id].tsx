import {useLocalSearchParams} from "expo-router";
import {useCallback, useState} from "react";
import {View} from "react-native";

import AddProductImage from "@/components/products/add-product-image";
import RemoveProductImage from "@/components/products/remove-product-image";
import UpdateProduct from "@/components/products/update-product";
import SegmentedControl from "@/components/ui/segmented-control";

const UpdateProductScreen = () => {
  const {id} = useLocalSearchParams();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = useCallback((index: number) => {
    setTabIndex(index);
  }, []);

  return (
    <View className="px-3" style={{flex: 1}}>
      <SegmentedControl
        tabs={["Product", "Add Image", "Remove Image"]}
        currentIndex={tabIndex}
        onChange={handleTabsChange}
        segmentedControlBackgroundColor="#fff"
        activeSegmentBackgroundColor="#1D4ED8"
        textColor="#000"
        activeTextColor="#fff"
        paddingVertical={10}
      />
      {tabIndex === 0 && <UpdateProduct id={id as string} />}
      {tabIndex === 1 && <AddProductImage id={id as string} />}
      {tabIndex === 2 && <RemoveProductImage id={id as string} />}
    </View>
  );
};

export default UpdateProductScreen;
