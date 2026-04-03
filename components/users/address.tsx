import {Ionicons} from "@expo/vector-icons";
import {useMutation} from "convex/react";
import {useCallback, useState} from "react";
import {Alert, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {Colors} from "@/constant/colors";

import AnimatedListItem from "../ui/animated-list-item";

interface AddressProps {
  _id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
  _creationTime?: any;
  index: number;
}

const Address = ({
  _id,
  name,
  city,
  state,
  country,
  zip,
  addressline,
  _creationTime,
  index,
}: AddressProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteAddress = useMutation(api.addresses.deleteAddress);

  const handleDeleteAddress = useCallback(async () => {
    try {
      setDeleteLoading(true);

      Alert.alert(
        "Delete Address",
        "Are you sure you want to delete this address?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await deleteAddress({addressId: _id as Id<"addresses">});

              ToastAndroid.showWithGravityAndOffset(
                "Address deleted successfully",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            },
            style: "destructive",
          },
        ],
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } finally {
      setDeleteLoading(false);
    }
  }, [_id, deleteAddress]);

  return (
    <AnimatedListItem index={index}>
      <View>
        <View className="flex flex-row items-center justify-between w-full">
          <View>
            <Text className="text-lg capitalize font-bold dark:text-white">
              {name}
            </Text>
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                className="p-1"
                style={{ marginRight: 8 }}
                disabled={deleteLoading}
                onPress={() => router.push(`/address/update/${_id}`)}
              >
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.background}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-1"
                disabled={deleteLoading}
                onPress={handleDeleteAddress}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="#ef4444"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex-1 gap-1.5 mt-3">
          <Text className="text-base dark:text-white">
            {city}, {state}, {country}, {zip}, {addressline}
          </Text>
          <View className="flex flex-row items-center gap-3 mt-2">
            <Ionicons
              name="refresh-circle"
              size={18}
              color={Colors.background}
            />
            <Text className="text-base dark:text-white">
              Created at: {new Date(_creationTime as any).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedListItem>
  );
};

export default Address;
