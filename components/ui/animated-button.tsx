import {Ionicons} from "@expo/vector-icons";
import {memo} from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  state: "idle" | "loading" | "success" | "error";
}

const AnimatedButton = memo(({onPress, title, state}: AnimatedButtonProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      mass: 0.5,
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      mass: 0.8,
      damping: 15,
      stiffness: 150,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={state === "loading"}
    >
      <Animated.View
        style={animatedStyle}
        className={`bg-primary rounded-full py-3 items-center mb-4 ${state === "loading" && "bg-blue-300"}`}
      >
        {state === "idle" && (
          <Text className="text-lg font-medium text-white">{title}</Text>
        )}
        {state === "loading" && <ActivityIndicator color="white" />}
        {state === "success" && (
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkbox" color="white" size={24} />
            <Text className="text-lg font-medium text-white">Success!</Text>
          </View>
        )}
        {state === "error" && (
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning" color="white" size={24} />
            <Text className="text-lg font-medium text-white">Error!</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
