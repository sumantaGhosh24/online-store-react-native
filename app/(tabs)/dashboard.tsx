import {ScrollView, Text, View} from "react-native";

import FinancialSummaryChart from "@/components/dashboard/financial-summary-chart";
import ProductSummaryCharts from "@/components/dashboard/product-summary-chart";
import ReviewSummaryChart from "@/components/dashboard/review-summary-chart";
import UserSummaryChart from "@/components/dashboard/user-summary-chart";
import AnimatedCard from "@/components/ui/animated-card";

const Dashboard = () => {
  return (
    <ScrollView className="flex-1" contentContainerClassName="py-[40] px-[20]">
      <Text className="text-2xl font-bold mb-[4] dark:text-white">
        Online Store Analytics Dashboard
      </Text>
      <Text className="text-lg mb-[20] dark:text-white">
        Visualizing data from database.
      </Text>
      <AnimatedCard>
        <UserSummaryChart />
      </AnimatedCard>
      <AnimatedCard>
        <ProductSummaryCharts />
      </AnimatedCard>
      <AnimatedCard>
        <ReviewSummaryChart />
      </AnimatedCard>
      <AnimatedCard>
        <FinancialSummaryChart />
      </AnimatedCard>
      <View className="h-[50]" />
    </ScrollView>
  );
};

export default Dashboard;
