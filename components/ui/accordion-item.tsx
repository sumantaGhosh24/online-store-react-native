import {Ionicons} from "@expo/vector-icons";
import {memo, useCallback} from "react";
import {Pressable, Text, useColorScheme, View} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItem = memo(({title, content}: AccordionItemProps) => {
  const theme = useColorScheme();

  const expanded = useSharedValue(0);

  const toggle = useCallback(() => {
    expanded.value = withTiming(expanded.value ? 0 : 1, {
      duration: 250,
    });
  }, [expanded]);

  const contentStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(expanded.value, [0, 1], [0, 80]),
      opacity: expanded.value,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(expanded.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return (
    <View className="bg-white dark:bg-gray-900 rounded-2xl mb-3 shadow-sm overflow-hidden">
      <Pressable
        onPress={toggle}
        className="flex-row justify-between items-center p-4"
      >
        <Text className="text-base font-semibold flex-1 pr-3 dark:text-white">
          {title}
        </Text>
        <Animated.View style={iconStyle}>
          <Ionicons
            name="chevron-down"
            size={22}
            color={theme === "dark" ? "white" : "#374151"}
          />
        </Animated.View>
      </Pressable>
      <Animated.View style={contentStyle}>
        <View className="px-4 pb-4">
          <Text className="text-gray-600 dark:text-gray-300">{content}</Text>
        </View>
      </Animated.View>
    </View>
  );
});

AccordionItem.displayName = "AccordionItem";

export default AccordionItem;
