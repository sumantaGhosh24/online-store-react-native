import {Ionicons} from "@expo/vector-icons";
import {memo, useEffect} from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  state: "idle" | "loading" | "success" | "error";
}

const AnimatedButton = memo(({onPress, title, state}: AnimatedButtonProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (state === "success" || state === "error") {
      const timeout = setTimeout(() => {
        opacity.value = withTiming(1);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      disabled={state === "loading"}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        style={animatedStyle}
        className={`rounded-xl py-3 items-center mb-4 ${
          state === "loading"
            ? "bg-blue-300"
            : state === "error"
              ? "bg-red-500"
              : state === "success"
                ? "bg-green-500"
                : "bg-blue-600"
        }`}
      >
        {state === "loading" && <ActivityIndicator color="white" />}

        {state === "idle" && (
          <Text className="text-lg font-semibold text-white">{title}</Text>
        )}

        {state === "success" && (
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={22} color="white" />
            <Text className="text-white font-semibold">Success</Text>
          </View>
        )}

        {state === "error" && (
          <View className="flex-row items-center gap-2">
            <Ionicons name="close-circle" size={22} color="white" />
            <Text className="text-white font-semibold">Try Again</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
