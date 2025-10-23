import {useQuery} from "convex/react";
import {memo, ReactNode} from "react";
import {Text, useColorScheme, View} from "react-native";
import {BarChart} from "react-native-gifted-charts";

import {api} from "@/convex/_generated/api";

interface CardProps {
  title: string;
  value: string | number;
  unit?: string;
}

const Card = ({title, value, unit = ""}: CardProps) => (
  <View className="flex-1 bg-gray-300 p-[12] rounded-[8] mx-[4] items-center justify-center dark:bg-gray-600">
    <Text className="text-base text-gray-700 mb-[4] dark:text-gray-200">
      {title}
    </Text>
    <Text className="text-base font-bold dark:text-white">
      {unit}
      {value.toLocaleString()}
    </Text>
  </View>
);

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

const ChartContainer = ({title, children}: ChartContainerProps) => (
  <View className="bg-white rounded-[12] p-[16] mb-[20] elevation dark:bg-gray-800">
    <Text className="text-xl font-bold mb-[15] border-b-2 border-b-gray-300 pb-[8] dark:text-white">
      {title}
    </Text>
    {children}
  </View>
);

const ReviewSummaryChart = memo(() => {
  const reviewSummary = useQuery(api.dashboard.getReviewSummary);

  const ratingColors = {
    1: "#ef4444",
    2: "#f97316",
    3: "#fbbf24",
    4: "#34d399",
    5: "#10b981",
  } as any;

  const chartData = Object.entries(reviewSummary?.ratingDistribution ?? {}).map(
    ([key, value]) => ({
      value: value,
      label: `${key} Star`,
      frontColor: ratingColors[key],
      gradientColor: `${ratingColors[key]}80`,
    })
  );

  const theme = useColorScheme();

  return (
    <ChartContainer title="Customer Rating Distribution (1-5 Stars)">
      <View className="flex-row justify-between mb-[15]">
        <Card title="Total Reviews" value={reviewSummary?.totalReviews ?? 0} />
        <Card
          title="Avg. Rating"
          value={reviewSummary?.overallAverageRating.toFixed(1) ?? 0}
        />
      </View>
      <BarChart
        data={chartData as any}
        barWidth={30}
        initialSpacing={15}
        spacing={20}
        frontColor="transparent"
        showGradient
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        height={180}
        maxValue={Math.max(
          ...(Object.values(reviewSummary?.ratingDistribution ?? {}) as any)
        )}
        noOfSections={4}
        barBorderRadius={5}
        xAxisLabelTextStyle={{color: theme === "dark" ? "white" : "black"}}
        yAxisTextStyle={{color: theme === "dark" ? "white" : "black"}}
      />
    </ChartContainer>
  );
});

ReviewSummaryChart.displayName = "ReviewSummaryChart";

export default ReviewSummaryChart;
