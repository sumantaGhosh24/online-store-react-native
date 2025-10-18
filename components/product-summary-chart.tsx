import {useQuery} from "convex/react";
import {ReactNode} from "react";
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

const ProductSummaryCharts = () => {
  const productSummary = useQuery(api.dashboard.getProductSummary);

  const inventoryData = [
    {
      value: productSummary?.totalStock ?? 0,
      label: "Stock",
      frontColor: "#34d399",
      gradientColor: "#6ee7b7",
    },
    {
      value: productSummary?.totalUnitsSold ?? 0,
      label: "Sold",
      frontColor: "#fb923c",
      gradientColor: "#fdba74",
    },
    {
      value: productSummary?.lowStockProducts ?? 0 * 200,
      label: "Low Stock",
      frontColor: "#ef4444",
      gradientColor: "#fca5a5",
    },
  ];

  const topSalesData =
    typeof productSummary?.topSellingProducts !== "undefined" &&
    productSummary?.topSellingProducts?.map((p: any, index: number) => ({
      value: p.sold,
      label: p.title
        .split(" ")
        .map((word: any) => word[0])
        .join(""),
      frontColor: index === 0 ? "#155dfc" : "#818cf8",
      gradientColor: index === 0 ? "#6366f1" : "#a5b4fc",
      labelComponent: () => (
        <Text
          style={{width: 60, textAlign: "center", fontSize: 10, color: "#333"}}
        >
          {p.title}
        </Text>
      ),
    }));

  const maxSales =
    typeof productSummary?.topSellingProducts !== "undefined" &&
    productSummary!.topSellingProducts?.length > 0
      ? productSummary?.topSellingProducts[0]?.sold
      : 100;

  const theme = useColorScheme();

  return (
    <>
      <ChartContainer title="Inventory Health Overview">
        <View className="flex-row justify-between mb-[15]">
          <Card
            title="Total Products"
            value={productSummary?.totalProducts ?? 0}
          />
          <Card
            title="Avg. Price"
            value={productSummary?.averagePrice.toFixed(2) ?? 0}
            unit="₹"
          />
        </View>
        <BarChart
          data={inventoryData}
          barWidth={30}
          initialSpacing={20}
          spacing={20}
          frontColor="transparent"
          showGradient
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          height={180}
          maxValue={productSummary?.totalStock ?? 0}
          noOfSections={4}
          barBorderRadius={5}
          xAxisLabelTextStyle={{color: theme === "dark" ? "white" : "black"}}
          yAxisTextStyle={{color: theme === "dark" ? "white" : "black"}}
        />
        <Text className="text-xs text-gray-400 mt-[5] text-center italic">
          *Low Stock value is scaled for visibility against Total Stock.
        </Text>
      </ChartContainer>
      <ChartContainer title="Top 5 Selling Products (Units Sold)">
        <BarChart
          data={topSalesData as any}
          barWidth={40}
          initialSpacing={20}
          spacing={30}
          frontColor="transparent"
          showGradient
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          height={180}
          maxValue={maxSales ?? 0}
          noOfSections={4}
          barBorderRadius={5}
          xAxisLabelTextStyle={{color: theme === "dark" ? "white" : "black"}}
          yAxisTextStyle={{color: theme === "dark" ? "white" : "black"}}
        />
      </ChartContainer>
    </>
  );
};

export default ProductSummaryCharts;
