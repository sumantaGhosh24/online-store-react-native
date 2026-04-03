import {FlatList} from "react-native";

import {faqData} from "@/constant";
import AccordionItem from "@/components/ui/accordion-item";

const Help = () => {
  return (
    <FlatList
      data={faqData}
      keyExtractor={(item) => `accordion-${item.id}`}
      renderItem={({item}) => (
        <AccordionItem title={item.question} content={item.answer} />
      )}
      contentContainerStyle={{padding: 12, paddingBottom: 40}}
      removeClippedSubviews
      initialNumToRender={6}
      windowSize={5}
    />
  );
};

export default Help;
