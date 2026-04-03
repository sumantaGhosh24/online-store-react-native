import {useMutation} from "convex/react";
import {useCallback, useState} from "react";
import {ToastAndroid, View} from "react-native";

import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import AnimatedButton from "../ui/animated-button";

interface UpdateOrderProps {
  id: Id<"orders">;
}

const UpdateOrder = ({id}: UpdateOrderProps) => {
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const updateOrder = useMutation(api.orders.updateOrder);

  const handleUpdateOrder = useCallback(async () => {
    setLoading("loading");

    try {
      await updateOrder({
        id: id,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
      });

      setLoading("success");

      ToastAndroid.showWithGravityAndOffset(
        "Order updated successfully",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    } catch (error: any) {
      setLoading("error");
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    }
  }, [id, updateOrder]);

  return (
    <View className="px-3">
      <AnimatedButton
        title="Delivered Order"
        state={loading}
        onPress={handleUpdateOrder}
      />
    </View>
  );
};

export default UpdateOrder;
