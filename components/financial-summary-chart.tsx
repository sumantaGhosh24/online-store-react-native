import {useQuery} from "convex/react";
import {ReactNode} from "react";
import {Text, useColorScheme, View} from "react-native";
import {BarChart, PieChart} from "react-native-gifted-charts";

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

const FinancialSummaryChart = () => {
  const financialSummary = useQuery(api.dashboard.getFinancialSummary);

  const chartData = [
    {
      value: financialSummary?.completedOrders ?? 0,
      label: "Completed",
      frontColor: "#34d399",
      gradientColor: "#6ee7b7",
    },
    {
      value: financialSummary?.cancelledOrders ?? 0,
      label: "Cancelled",
      frontColor: "#f87171",
      gradientColor: "#fca5a5",
    },
  ];

  const theme = useColorScheme();

  return (
    <ChartContainer title="Order Status and Value">
      <View className="flex-row justify-between mb-[15]">
        <Card
          title="Total Revenue"
          value={financialSummary?.totalRevenue ?? 0}
          unit="₹"
        />
        <Card
          title="Avg. Order Value"
          value={financialSummary?.averageOrderValue.toFixed(2) ?? 0}
          unit="₹"
        />
      </View>
      <View className="flex-row justify-around items-center">
        <View style={{flex: 1, alignItems: "center"}}>
          <Text className="text-base font-medium mb-[10] dark:text-white">
            Order Status
          </Text>
          <PieChart
            data={chartData.map((item) => ({
              ...item,
              color: item.frontColor,
              text: `${Math.round((item.value / (financialSummary?.totalOrders ?? 0)) * 100)}%`,
            }))}
            radius={60}
            donut
            innerRadius={30}
            showText
            centerLabelComponent={() => (
              <Text style={{fontSize: 10, color: "#333"}}>
                {financialSummary?.totalOrders ?? 0}
              </Text>
            )}
            labelsPosition="outward"
            sectionAutoFocus
            focusOnPress
          />
        </View>
        <View style={{flex: 1, alignItems: "center"}}>
          <Text className="text-base font-medium mb-[10] dark:text-white">
            Orders & Revenue
          </Text>
          <BarChart
            data={[
              {
                value: financialSummary?.totalOrders ?? 0 / 100,
                label: "Orders",
                frontColor: "#6366f1",
                gradientColor: "#a5b4fc",
              },
              {
                value: financialSummary?.totalRevenue ?? 0 / 10000,
                label: "Revenue",
                frontColor: "#16a34a",
                gradientColor: "#34d399",
              },
            ]}
            barWidth={35}
            initialSpacing={15}
            spacing={15}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            height={150}
            maxValue={
              Math.max(
                financialSummary?.totalOrders ?? 0 / 100,
                financialSummary?.totalRevenue ?? 0 / 10000
              ) + 10
            }
            noOfSections={4}
            barBorderRadius={5}
            hideYAxisText
            xAxisLabelTextStyle={{color: theme === "dark" ? "white" : "black"}}
          />
          <Text className="text-xs text-gray-400 mt-[5] text-center italic">
            *Values scaled down for comparison: Orders / 100, Revenue / 10,000.
          </Text>
        </View>
      </View>
    </ChartContainer>
  );
};

export default FinancialSummaryChart;
