import {Ionicons} from "@expo/vector-icons";
import {useState} from "react";
import {Pressable, Text, useColorScheme, View} from "react-native";

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItem = ({title, content}: AccordionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const theme = useColorScheme();

  return (
    <View className="border-b border-gray-300 bg-gray-200 dark:bg-gray-700">
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row justify-between items-center p-4"
      >
        <Text className="text-lg font-semibold text-gray-800 flex-1 pr-4 dark:text-white">
          {title}
        </Text>
        {isExpanded ? (
          <Ionicons
            name="chevron-up"
            size={24}
            color={theme === "dark" ? "white" : "#374151"}
          />
        ) : (
          <Ionicons
            name="chevron-down"
            size={24}
            color={theme === "dark" ? "white" : "#374151"}
          />
        )}
      </Pressable>
      {isExpanded && (
        <View className="p-4 border-t border-gray-100">
          <Text className="text-gray-600 dark:text-white">{content}</Text>
        </View>
      )}
    </View>
  );
};

export default AccordionItem;
