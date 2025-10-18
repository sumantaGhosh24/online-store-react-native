import {Ionicons} from "@expo/vector-icons";
import {router, Stack} from "expo-router";
import React from "react";
import {TouchableOpacity} from "react-native";

import ThemeSettingModal from "@/components/theme-setting-modal";
import {Colors} from "@/constant/colors";

const Preference = () => {
  return (
    <>
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
      <ThemeSettingModal />
    </>
  );
};

export default Preference;
