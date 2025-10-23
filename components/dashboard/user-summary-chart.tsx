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

const UserSummaryChart = memo(() => {
  const userSummary = useQuery(api.dashboard.getUserSummary);

  const chartData = [
    {
      value: userSummary?.userCount ?? 0,
      label: "Users",
      frontColor: "#4c7aff",
      gradientColor: "#7a9eff",
    },
    {
      value: userSummary?.adminCount ?? 0,
      label: "Admins",
      frontColor: "#e040fb",
      gradientColor: "#f188fe",
    },
  ];

  const theme = useColorScheme();

  return (
    <ChartContainer title="User Roles Distribution">
      <View className="flex-row justify-between mb-[15]">
        <Card title="Total Users" value={userSummary?.totalUsers ?? 0} />
        <Card title="Admins" value={userSummary?.adminCount ?? 0} />
      </View>
      <BarChart
        data={chartData}
        barWidth={40}
        initialSpacing={20}
        spacing={40}
        frontColor="transparent"
        showGradient
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        height={180}
        maxValue={userSummary?.totalUsers ?? 0}
        noOfSections={4}
        barBorderRadius={5}
        xAxisLabelTextStyle={{color: theme === "dark" ? "white" : "black"}}
        yAxisTextStyle={{color: theme === "dark" ? "white" : "black"}}
      />
    </ChartContainer>
  );
});

UserSummaryChart.displayName = "UserSummaryChart";

export default UserSummaryChart;
