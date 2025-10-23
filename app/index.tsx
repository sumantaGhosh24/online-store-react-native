import {useCallback} from "react";
import {ImageBackground, Text, View} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import {SafeAreaView} from "react-native-safe-area-context";

import {onboardingSwiperData} from "@/constant";
import {useAuthStore} from "@/store";

interface OnboardingDataType {
  id: number;
  title: string;
  description: string;
  sortDescription: string;
  image: any;
}

const RenderSlide = ({item}: {item: OnboardingDataType}) => (
  <SafeAreaView>
    <ImageBackground
      source={item.image}
      className="h-screen flex items-center justify-center"
    >
      <View className="flex gap-4 w-[80%] mx-auto bg-black/70 p-5 rounded-lg shadow-xl">
        <Text className="text-center text-3xl font-bold capitalize text-white">
          {item.title}
        </Text>
        <Text className="text-center text-lg font-medium capitalize text-white">
          {item.description}
        </Text>
        <Text className="text-center text-base font-medium capitalize text-white">
          {item.sortDescription}
        </Text>
      </View>
    </ImageBackground>
  </SafeAreaView>
);

const RenderButton = ({
  label,
  marginBottom,
}: {
  label: string;
  marginBottom: string;
}) => (
  <View
    className={`bg-blue-700 rounded-xl py-2.5 px-4 flex flex-row justify-center items-center ${marginBottom}`}
  >
    <Text className="text-white font-semibold text-lg">{label}</Text>
  </View>
);

export default function Onboarding() {
  const {completeOnboarding} = useAuthStore();

  const onDoneHandler = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const memoizedRenderItem = useCallback(
    ({item}: {item: OnboardingDataType}) => <RenderSlide item={item} />,
    []
  );

  return (
    <AppIntroSlider
      renderItem={memoizedRenderItem}
      data={onboardingSwiperData}
      onDone={onDoneHandler}
      onSkip={onDoneHandler}
      renderNextButton={() => <RenderButton label="Next" marginBottom="mb-5" />}
      renderSkipButton={() => (
        <RenderButton label="Skip" marginBottom="mb-20" />
      )}
      renderDoneButton={() => (
        <RenderButton label="Done" marginBottom="mb-20" />
      )}
      showSkipButton={true}
      dotStyle={{backgroundColor: "gray"}}
      bottomButton={true}
      activeDotStyle={{backgroundColor: "#1D4ED8"}}
    />
  );
}
