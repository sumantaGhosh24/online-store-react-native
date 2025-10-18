import {ScrollView, Text, View} from "react-native";

import FinancialSummaryChart from "@/components/financial-summary-chart";
import ProductSummaryCharts from "@/components/product-summary-chart";
import ReviewSummaryChart from "@/components/review-summary-chart";
import UserSummaryChart from "@/components/user-summary-chart";

const Dashboard = () => {
  return (
    <ScrollView className="flex-1" contentContainerClassName="py-[40] px-[20]">
      <Text className="text-2xl font-bold mb-[4] dark:text-white">
        Online Store Analytics Dashboard
      </Text>
      <Text className="text-lg mb-[20] dark:text-white">
        Visualizing data from database.
      </Text>
      <UserSummaryChart />
      <ProductSummaryCharts />
      <ReviewSummaryChart />
      <FinancialSummaryChart />
      <View className="h-[50]" />
    </ScrollView>
  );
};

export default Dashboard;
