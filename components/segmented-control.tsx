import {useCallback, useEffect, useState} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
};

const width = Dimensions.get("screen").width - 32;

interface SegmentedControlProps {
  tabs: string[];
  currentIndex: number;
  onChange: (index: number) => void;
  segmentedControlBackgroundColor?: string;
  activeSegmentBackgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  paddingVertical?: number;
}

const SegmentedControl = ({
  tabs,
  onChange,
  currentIndex,
  segmentedControlBackgroundColor,
  paddingVertical,
  activeSegmentBackgroundColor,
  textColor,
  activeTextColor,
}: SegmentedControlProps) => {
  const translateValue = (width - 4) / tabs?.length;
  const [tabTranslate] = useState(new Animated.Value(0));

  const memoizedTabPressCallback = useCallback((index: number) => {
    onChange(index);
  }, []);

  useEffect(() => {
    Animated.spring(tabTranslate, {
      toValue: currentIndex * translateValue,
      stiffness: 180,
      damping: 20,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  return (
    <Animated.View
      style={[
        styles.segmentedControlWrapper,
        {
          backgroundColor: segmentedControlBackgroundColor,
        },
        {
          paddingVertical: paddingVertical,
        },
      ]}
    >
      <Animated.View
        style={[
          {
            ...(StyleSheet.absoluteFill as any),
            position: "absolute",
            width: (width - 4) / tabs?.length,
            top: 0,
            marginVertical: 2,
            marginHorizontal: 2,
            backgroundColor: activeSegmentBackgroundColor,
            borderRadius: 8,
            ...shadow,
          },
          {
            transform: [
              {
                translateX: tabTranslate,
              },
            ],
          },
        ]}
      ></Animated.View>
      {tabs.map((tab, index) => {
        const isCurrentIndex = currentIndex === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.textWrapper]}
            onPress={() => memoizedTabPressCallback(index)}
            activeOpacity={0.7}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.textStyles,
                {color: textColor},
                isCurrentIndex && {color: activeTextColor},
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  segmentedControlWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    width: width,
    marginVertical: 15,
  },
  textWrapper: {
    flex: 1,
    elevation: 9,
    paddingHorizontal: 3,
  },
  textStyles: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default SegmentedControl;
