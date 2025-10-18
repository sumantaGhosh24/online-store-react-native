import {Ionicons} from "@expo/vector-icons";
import * as Application from "expo-application";
import {router, Stack} from "expo-router";
import * as Updates from "expo-updates";
import {useEffect} from "react";
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {Colors} from "@/constant/colors";

const AboutApplication = () => {
  const {isUpdateAvailable, isUpdatePending} = Updates.useUpdates();

  useEffect(() => {
    Updates.checkForUpdateAsync();
  }, []);

  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
    } catch {
      Alert.alert(
        "Update Failed",
        "Failed to download the update. Please try again."
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingTop: 32,
        gap: 24,
      }}
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
      <View className="bg-gray-200 dark:bg-gray-800 rounded-md p-4 px-2">
        <Text className="text-center dark:text-white">
          Online Store: Sync & Share
        </Text>
        <Text className="text-center opacity-[0.7] dark:text-white">
          v{Application.nativeApplicationVersion}
        </Text>
      </View>
      <View className="bg-gray-200 dark:bg-gray-800 rounded-md p-4 px-2">
        <View className="flex flex-row justify-between items-center px-2">
          <Text className="dark:text-white">Channel</Text>
          <Text className="dark:text-white">{Updates.channel}</Text>
        </View>
        <View className="flex flex-row justify-between items-center px-2 my-2">
          <Text className="dark:text-white">Last update</Text>
          <Text className="dark:text-white">
            {new Date(Updates.createdAt as any).toDateString()}
          </Text>
        </View>
        <View className="flex flex-row justify-between items-center px-2">
          <View className="flex-1">
            <View className="flex-row justify-between">
              <Text className="dark:text-white">Update ID</Text>
              <Text className="text-xs dark:text-white">
                {Updates.isEmbeddedLaunch ? " (Embedded)" : " (Downloaded)"}
              </Text>
            </View>
            <Text className="text-xs dark:text-white" numberOfLines={2}>
              {Updates.updateId}
            </Text>
          </View>
        </View>
        {isUpdateAvailable ? (
          <View>
            <Text className="text-[#34C759]">A new update is available!</Text>
            <Button
              onPress={handleUpdate}
              title="Download and install update"
            />
          </View>
        ) : (
          <Button
            onPress={() =>
              Alert.alert(
                "✅ All clear!",
                "Even the bugs are taking a day off!"
              )
            }
            title="No bug fixes available"
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AboutApplication;
