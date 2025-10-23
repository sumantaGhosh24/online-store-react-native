import {ScrollView, View} from "react-native";

import AccordionItem from "@/components/ui/accordion-item";

const faqData = [
  {
    id: 1,
    question: "What is your shipping policy?",
    answer:
      "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). All orders over $50 qualify for free standard shipping in the US.",
  },
  {
    id: 2,
    question: "How do I return an item?",
    answer:
      "Returns are accepted within 30 days of purchase. Please visit our 'Returns Portal' on the website and follow the steps to generate a prepaid shipping label.",
  },
  {
    id: 3,
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 50 countries worldwide. International shipping fees and delivery times vary based on location. Customs duties and taxes may apply upon arrival.",
  },
  {
    id: 4,
    question: "Can I change my order after it's been placed?",
    answer:
      "Unfortunately, once an order is placed, it immediately enters processing, and we cannot guarantee changes. Please contact customer support immediately, and we will do our best to assist you.",
  },
];

const Help = () => {
  return (
    <ScrollView className="p-3" removeClippedSubviews={true}>
      {faqData.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.question}
          content={item.answer}
        />
      ))}
      <View className="h-20" />
    </ScrollView>
  );
};

export default Help;
