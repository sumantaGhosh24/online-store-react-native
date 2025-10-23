import {memo, ReactNode, useEffect} from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedCardProps {
  children: ReactNode;
}

const AnimatedCard = memo(({children}: AnimatedCardProps) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {duration: 500});
    opacity.value = withTiming(1, {duration: 700});
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

AnimatedCard.displayName = "AnimatedCard";

export default AnimatedCard;
