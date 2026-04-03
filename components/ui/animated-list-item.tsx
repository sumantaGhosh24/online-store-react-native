import {memo, ReactNode} from "react";
import Animated, {FadeInUp, FadeOutLeft} from "react-native-reanimated";

interface AnimatedListItemProps {
  index: number;
  children: ReactNode;
}

const AnimatedListItem = memo(({index, children}: AnimatedListItemProps) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(500)}
      exiting={FadeOutLeft.duration(300)}
      className="flex-row items-center gap-4 px-5 py-3 bg-white dark:bg-gray-900 mx-3 my-2 rounded-md"
    >
      {children}
    </Animated.View>
  );
});

AnimatedListItem.displayName = "AnimatedListItem";

export default AnimatedListItem;
