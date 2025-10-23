import {memo, useEffect} from "react";
import {Control, Controller} from "react-hook-form";
import {TextInput, TextInputProps, View} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label: string;
  error?: string;
  setLoading: (loading: "idle" | "loading" | "success" | "error") => void;
}

const AnimatedInput = memo(
  ({control, name, label, error, setLoading, ...props}: AnimatedInputProps) => {
    const labelY = useSharedValue(0);
    const labelScale = useSharedValue(1);
    const borderColor = useSharedValue("#d1d5db");

    useEffect(() => {
      borderColor.value = error ? withTiming("#ef4444") : withTiming("#d1d5db");
    }, [error]);

    const animatedLabelStyle = useAnimatedStyle(() => ({
      position: "absolute",
      left: 12,
      top: withTiming(labelY.value, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      }),
      transform: [{scale: withTiming(labelScale.value, {duration: 200})}],
    }));

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderColor: withTiming(borderColor.value, {duration: 200}),
    }));

    return (
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, onBlur, value}}) => (
          <View className="mb-5">
            <Animated.View
              style={[animatedBorderStyle]}
              className="relative border rounded-lg bg-white dark:bg-gray-800 px-3 pt-5 pb-2"
            >
              <Animated.Text
                style={[animatedLabelStyle]}
                className="text-gray-500 dark:text-gray-300"
              >
                {label}
              </Animated.Text>
              <TextInput
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setLoading("idle");
                  if (text.length > 0) {
                    labelY.value = -2;
                    labelScale.value = 0.85;
                  } else {
                    labelY.value = 10;
                    labelScale.value = 1;
                  }
                }}
                onFocus={() => {
                  borderColor.value = "#3b82f6";
                  labelY.value = -2;
                  labelScale.value = 0.85;
                }}
                onBlur={() => {
                  onBlur();
                  borderColor.value = error ? "#ef4444" : "#d1d5db";
                  if (!value) {
                    labelY.value = 10;
                    labelScale.value = 1;
                  }
                }}
                className="text-base text-black dark:text-white"
                {...props}
              />
            </Animated.View>
            {error && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                className="text-red-500 text-sm mt-1"
              >
                {error}
              </Animated.Text>
            )}
          </View>
        )}
      />
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
