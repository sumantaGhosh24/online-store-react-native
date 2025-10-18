import {useMutation} from "convex/react";
import {useState} from "react";
import {
  ActivityIndicator,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

interface UpdateOrderProps {
  id: Id<"orders">;
}

const UpdateOrder = ({id}: UpdateOrderProps) => {
  const [loading, setLoading] = useState(false);

  const updateOrder = useMutation(api.orders.updateOrder);

  const handleUpdateOrder = async () => {
    try {
      await updateOrder({
        id: id,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
      });

      ToastAndroid.showWithGravityAndOffset(
        "Order updated successfully",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="bg-primary rounded-full py-3 items-center mb-4 disabled:bg-blue-300"
      onPress={handleUpdateOrder}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-lg font-medium text-white">Delivered Order</Text>
      )}
    </TouchableOpacity>
  );
};

export default UpdateOrder;
