import {useQuery} from "convex/react";
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

interface CartAddressProps {
  checkout?: boolean;
}

const CartAddress = ({checkout}: CartAddressProps) => {
  const {address, removeAddress} = useCartStore();

  const addressData = useQuery(api.addresses.getAddress, {
    id: address as Id<"addresses">,
  });

  const handleRemoveAddress = () => {
    removeAddress();
  };

  return (
    <View className="flex-row items-center justify-between p-3 mb-3 bg-white dark:bg-gray-800">
      <View className="flex-row items-center gap-2">
        <Ionicons name="location" size={18} color="#155dfc" />
        <View>
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            Address Selected
          </Text>
          <Text className="text-sm font-bold uppercase text-blue-700 dark:text-blue-300">
            {addressData?.name}
          </Text>
          <Text className="text-xs text-blue-600">
            {addressData?.city}, {addressData?.state}, {addressData?.country},{" "}
            {addressData?.zip}, {addressData?.addressline}
          </Text>
        </View>
      </View>
      {!checkout && (
        <TouchableOpacity
          onPress={handleRemoveAddress}
          className="flex-row items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full"
        >
          <Ionicons name="close-circle" size={16} color="#ef4444" />
          <Text className="text-xs font-semibold text-red-500">Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartAddress;
