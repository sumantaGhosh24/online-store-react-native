import {useQuery} from "convex/react";
import {useState} from "react";
import {
  ActivityIndicator,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {useColorScheme} from "nativewind";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useCartStore} from "@/store/cart";

const CartApplyAddress = () => {
  const {setAddress: selectAddress} = useCartStore();

  const {colorScheme} = useColorScheme();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const addresses = useQuery(api.addresses.getAddresses);

  const handleSubmit = async () => {
    if (address === "") return setError("Please select a address");

    setLoading(true);
    setError("");

    try {
      selectAddress(address as Id<"addresses">);

      ToastAndroid.showWithGravityAndOffset(
        "Address selected",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 pt-10 mb-3 bg-white dark:bg-gray-800">
      <Text className="text-base font-semibold mb-2 dark:text-white">
        Select Address
      </Text>
      <Picker
        selectedValue={address}
        onValueChange={setAddress}
        style={{backgroundColor: colorScheme === "dark" ? "#1f2937" : "white"}}
      >
        <Picker.Item label="Select your address" value="" />
        {addresses?.map((address) => (
          <Picker.Item
            key={address._id}
            label={address.name}
            value={address._id}
          />
        ))}
      </Picker>
      {error && <Text className="text-red-500 text-xs mb-2">{error}</Text>}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-primary px-4 py-2 rounded-xl justify-center items-center disabled:bg-blue-300"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Apply</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CartApplyAddress;
