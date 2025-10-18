import {Ionicons} from "@expo/vector-icons";
import {router, Stack} from "expo-router";
import {useState} from "react";
import {TouchableOpacity, View} from "react-native";

import NewPassword from "@/components/new-password";
import ResetEmail from "@/components/reset-email";
import {Colors} from "@/constant/colors";

const PwReset = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  return (
    <View>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          headerLeft: () =>
            !successfulCreation && (
              <TouchableOpacity
                className="items-center justify-center mr-5"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
            ),
        }}
      />

      {!successfulCreation && (
        <ResetEmail setSuccessfulCreation={setSuccessfulCreation} />
      )}

      {successfulCreation && <NewPassword />}
    </View>
  );
};

export default PwReset;
