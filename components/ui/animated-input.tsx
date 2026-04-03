import {memo, useEffect} from "react";
import {Control, Controller, useWatch} from "react-hook-form";
import {TextInput, TextInputProps, View} from "react-native";
import Animated, {
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
    const value = useWatch({control, name});

    const labelY = useSharedValue(18);
    const labelScale = useSharedValue(1);
    const borderColor = useSharedValue("#d1d5db");

    const animateUp = () => {
      labelY.value = withTiming(2, {duration: 180});
      labelScale.value = withTiming(0.85, {duration: 180});
    };

    const animateDown = () => {
      labelY.value = withTiming(18, {duration: 180});
      labelScale.value = withTiming(1, {duration: 180});
    };

    useEffect(() => {
      if (value) animateUp();
      else animateDown();
    }, [value]);

    useEffect(() => {
      borderColor.value = withTiming(error ? "#ef4444" : "#d1d5db");
    }, [error]);

    const labelStyle = useAnimatedStyle(() => ({
      position: "absolute",
      left: 12,
      top: labelY.value,
      transform: [{scale: labelScale.value}],
    }));

    const borderStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

    return (
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, onBlur, value}}) => (
          <View className="mb-5">
            <Animated.View
              style={borderStyle}
              className="border rounded-xl px-3 pt-5 pb-2 bg-white dark:bg-gray-900"
            >
              <Animated.Text
                style={labelStyle}
                className="text-gray-500 dark:text-white"
              >
                {label}
              </Animated.Text>
              <TextInput
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setLoading("idle");
                }}
                onFocus={() => {
                  borderColor.value = withTiming("#2563EB");
                  animateUp();
                }}
                onBlur={() => {
                  onBlur();
                  borderColor.value = withTiming(error ? "#ef4444" : "#d1d5db");
                  if (!value) animateDown();
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
  },
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
