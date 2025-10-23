import {Ionicons} from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {useColorScheme} from "nativewind";
import {memo, useCallback, useMemo, useRef} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import BoxedIcon from "../ui/boxed-icon";

const ThemeSettingModal = memo(() => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {colorScheme, toggleColorScheme} = useColorScheme();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleToggleColorScheme = useCallback(() => {
    toggleColorScheme();
  }, [toggleColorScheme]);

  const snapPoints = useMemo(() => ["25%", "40%"], []);

  return (
    <BottomSheetModalProvider>
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        backdropComponent={({style}) => (
          <View
            style={[
              style,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(0, 0, 0, 0.7)"
                    : "rgba(0, 0, 0, 0.5)",
              },
            ]}
          />
        )}
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
          <View>
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-lg mb-2"
              style={{
                backgroundColor:
                  colorScheme === "light" ? "#e5e5e5" : "#1f2937",
              }}
              disabled={colorScheme === "light"}
              onPress={handleToggleColorScheme}
            >
              <Ionicons
                name="sunny"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-lg ml-3 dark:text-white">
                Light {colorScheme === "light" && "(Active)"}
              </Text>
              {colorScheme === "light" && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#155dfc"
                  style={{marginLeft: "auto"}}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-lg mb-2"
              style={{
                backgroundColor: colorScheme === "dark" ? "#1f2937" : "#e5e5e5",
              }}
              disabled={colorScheme === "dark"}
              onPress={handleToggleColorScheme}
            >
              <Ionicons
                name="moon"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-lg ml-3 dark:text-white">
                Dark {colorScheme === "dark" && "(Active)"}
              </Text>
              {colorScheme === "dark" && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#155dfc"
                  style={{marginLeft: "auto"}}
                />
              )}
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

ThemeSettingModal.displayName = "ThemeSettingModal";

export default ThemeSettingModal;
