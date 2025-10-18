import {Ionicons} from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {useColorScheme} from "nativewind";
import {useCallback, useRef} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import BoxedIcon from "./boxed-icon";

const ThemeSettingModal = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {colorScheme, toggleColorScheme} = useColorScheme();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <View className="bg-white rounded-md mx-4 mt-3 dark:bg-gray-800">
        <TouchableOpacity
          className="flex-row items-center p-2.5 gap-2.5"
          onPress={handlePresentModalPress}
        >
          <BoxedIcon name="contrast" backgroundColor="#155dfc" />
          <Text className="text-xl flex-1 dark:text-white">Theme</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["25%", "50%"]}
          index={1}
          backgroundStyle={{
            backgroundColor: colorScheme === "dark" ? "#262626" : "#fff",
          }}
          handleIndicatorStyle={{
            backgroundColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        >
          <BottomSheetView style={{flex: 1, padding: 16}}>
            <Text className="text-xl font-semibold mb-4 dark:text-white">
              Theme Settings
            </Text>
            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-100 rounded-lg mb-2 dark:bg-gray-800"
              disabled={colorScheme === "light"}
              onPress={() => toggleColorScheme()}
            >
              <Ionicons
                name="sunny"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-lg ml-3 dark:text-white">
                Light {colorScheme === "light" && "(Active)"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-4 bg-gray-100 rounded-lg mb-2 dark:bg-gray-800"
              disabled={colorScheme === "dark"}
              onPress={() => toggleColorScheme()}
            >
              <Ionicons
                name="moon"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-lg ml-3 dark:text-white">
                Dark {colorScheme === "dark" && "(Active)"}
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default ThemeSettingModal;
