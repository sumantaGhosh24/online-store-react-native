import {FontAwesome6} from "@expo/vector-icons";
import {useColorScheme} from "nativewind";
import {memo} from "react";
import {Text, View} from "react-native";

import AnimatedButton from "./animated-button";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonTitle: string;
  handlePress: () => void;
}

const EmptyState = memo(
  ({title, subtitle, buttonTitle, handlePress}: EmptyStateProps) => {
    const {colorScheme} = useColorScheme();

    return (
      <View className="flex justify-center items-center p-4 w-[80%] mx-auto border border-secondary dark:border-white rounded bg-white dark:bg-black mt-5">
        <FontAwesome6
          name="hourglass-empty"
          size={48}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="text-sm font-medium my-3 text-black dark:text-white capitalize">
          {title}
        </Text>
        <Text className="text-xl text-center font-semibold text-black dark:text-white capitalize">
          {subtitle}
        </Text>
        <View className="w-full mt-5">
          <AnimatedButton
            onPress={handlePress}
            title={buttonTitle}
            state="idle"
          />
        </View>
      </View>
    );
  }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
