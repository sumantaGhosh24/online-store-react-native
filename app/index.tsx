import {useCallback, useRef, useState} from "react";
import {Image, Text, View, Animated, TouchableOpacity} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

import {onboardingSwiperData} from "@/constant";
import {useAuthStore} from "@/store";

interface OnboardingDataType {
  id: number;
  title: string;
  description: string;
  sortDescription: string;
  image: any;
}

interface PaginationProps {
  activeIndex: number;
  total: number;
  onDone: () => void;
  isLast: boolean;
}

const Pagination = ({activeIndex, total, onDone, isLast}: PaginationProps) => {
  const animations = useRef(
    Array.from({length: total}, () => new Animated.Value(0)),
  ).current;

  return (
    <View className="pb-6 bg-white">
      <View className="flex-row justify-center items-center mb-6">
        {animations.map((anim, index) => {
          const isActive = index === activeIndex;

          Animated.timing(anim, {
            toValue: isActive ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
          }).start();

          const width = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [6, 20],
          });

          const backgroundColor = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#D1D5DB", "#2563EB"],
          });

          return (
            <Animated.View
              key={index}
              style={{
                width,
                height: 6,
                borderRadius: 3,
                backgroundColor,
                marginHorizontal: 4,
              }}
            />
          );
        })}
      </View>
      <View className="px-5 gap-3">
        {isLast && (
          <View onTouchEnd={onDone}>
            <RenderButton label="Get Started" />
          </View>
        )}
      </View>
    </View>
  );
};

const RenderSlide = ({item}: {item: OnboardingDataType}) => (
  <SafeAreaView className="flex-1 bg-white">
    <View className="justify-between flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={item.image}
          resizeMode="contain"
          className="w-full h-[60%]"
        />
      </View>
      <View className="px-6 pb-10 pt-6 rounded-t-3xl">
        <Text className="text-2xl font-bold text-gray-900 text-center">
          {item.title}
        </Text>
        <Text className="text-gray-600 text-base text-center mt-3 leading-6">
          {item.description}
        </Text>
        <Text className="text-blue-600 text-sm font-semibold text-center mt-2">
          {item.sortDescription}
        </Text>
      </View>
    </View>
  </SafeAreaView>
);

const RenderButton = ({label}: {label: string}) => (
  <TouchableOpacity className="bg-blue-600 mx-5 mb-6 py-3 rounded-xl items-center shadow-md">
    <Text className="text-white font-semibold text-lg">{label}</Text>
  </TouchableOpacity>
);

export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);

  const {setHasCompletedOnboarding} = useAuthStore();

  const onDoneHandler = useCallback(() => {
    setHasCompletedOnboarding();
  }, [setHasCompletedOnboarding]);

  const memoizedRenderItem = useCallback(
    ({item}: {item: OnboardingDataType}) => <RenderSlide item={item} />,
    [],
  );

  const sliderRef = useRef<AppIntroSlider>(null);

  return (
    <>
      <AppIntroSlider
        ref={sliderRef}
        data={onboardingSwiperData}
        renderItem={memoizedRenderItem}
        onDone={onDoneHandler}
        onSlideChange={(index) => setActiveIndex(index)}
        renderPagination={() => (
          <Pagination
            activeIndex={activeIndex}
            total={onboardingSwiperData.length}
            isLast={activeIndex === onboardingSwiperData.length - 1}
            onDone={onDoneHandler}
          />
        )}
      />
      <StatusBar style="auto" />
    </>
  );
}
