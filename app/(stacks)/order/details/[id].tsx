import {useQuery} from "convex/react";
import {useLocalSearchParams} from "expo-router";
import {ScrollView, Text, View} from "react-native";

import PrintOrder from "@/components/orders/print-order";
import UpdateOrder from "@/components/orders/update-order";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

const Row = ({label, value, bold = false}: RowProps) => (
  <View className="flex-row justify-between">
    <Text className="text-gray-500 dark:text-white">{label}</Text>
    <Text className={`dark:text-white ${bold ? "font-bold" : ""}`}>
      {value}
    </Text>
  </View>
);

const OrderDetails = () => {
  const {id} = useLocalSearchParams();

  const order = useQuery(api.orders.getOrder, {id: id as Id<"orders">});

  const user = useQuery(api.users.getUser);
  const isAdmin = user?.role === "admin";

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white dark:bg-gray-900 m-3 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold mb-3 dark:text-white">
            Order Items
          </Text>
          {order?.orderItems.map((item) => (
            <View
              key={item?.product?._id}
              className="flex-row items-center mb-4"
            >
              <View className="flex-1">
                <Text className="font-semibold dark:text-white">
                  {item?.product?.title}
                </Text>
                <Text className="text-gray-500 dark:text-white text-sm">
                  Qty: {item.quantity} × ₹{item.product.price}
                </Text>
              </View>
              <Text className="font-bold dark:text-white">
                ₹{item.product.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>
        <View className="bg-white dark:bg-gray-900 mx-3 mb-3 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold mb-3 dark:text-white">
            Customer Details
          </Text>
          <Text className="dark:text-white capitalize">
            {order?.user?.name}
          </Text>
          <Text className="text-gray-500 dark:text-white">
            {order?.user?.email}
          </Text>
          <Text className="text-gray-500 dark:text-white">
            @{order?.user?.username}
          </Text>
        </View>
        {order?.coupon?.name !== "" && (
          <View className="bg-white dark:bg-gray-900 mx-3 mb-3 rounded-2xl p-4 shadow-sm">
            <Text className="text-lg font-bold mb-3 dark:text-white">
              Coupon Applied
            </Text>
            <Text className="dark:text-white font-semibold capitalize">
              {order?.coupon?.name}
            </Text>
            <Text className="text-gray-500 dark:text-white uppercase">
              {order?.coupon?.code}
            </Text>
            <Text className="text-green-500 font-bold mt-1">
              -₹{order?.coupon?.discount}
            </Text>
          </View>
        )}
        <View className="bg-white dark:bg-gray-900 mx-3 mb-3 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold mb-3 dark:text-white">
            Shipping Address
          </Text>
          <Text className="dark:text-white capitalize">
            {order?.shippingAddress?.address}
          </Text>
          <Text className="text-gray-500 dark:text-white">
            {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
          </Text>
          <Text className="text-gray-500 dark:text-white">
            {order?.shippingAddress?.country} - {order?.shippingAddress?.zip}
          </Text>
        </View>
        <View className="bg-white dark:bg-gray-900 mx-3 mb-3 rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-bold mb-3 dark:text-white">
            Payment Details
          </Text>
          <View className="flex-row gap-2 mb-3">
            <Text
              className={`text-white px-2 py-1 rounded-full text-xs uppercase ${
                order?.paymentStatus === "completed"
                  ? "bg-green-500"
                  : "bg-orange-500"
              }`}
            >
              {order?.paymentStatus}
            </Text>
            <Text
              className={`text-white px-2 py-1 rounded-full text-xs uppercase ${
                order?.isDelivered ? "bg-green-500" : "bg-orange-500"
              }`}
            >
              {order?.isDelivered ? "Delivered" : "Shipping"}
            </Text>
          </View>
          <View className="gap-1">
            <Row label="Price" value={`₹${order?.price}`} />
            <Row label="Discount" value={`₹${order?.discount}`} />
            <Row label="Total" value={`₹${order?.finalPrice}`} bold />
          </View>
          <Text className="text-gray-500 mt-3 text-sm dark:text-white">
            Paid: {new Date(order?.paidAt as any).toLocaleDateString()}
          </Text>
          {order?.isDelivered && (
            <Text className="text-gray-500 text-sm dark:text-white">
              Delivered:{" "}
              {new Date(order?.deliveredAt as any).toLocaleDateString()}
            </Text>
          )}
        </View>
        {!order?.isDelivered && isAdmin && (
          <UpdateOrder id={order?._id as Id<"orders">} />
        )}
        {order?.isDelivered && <PrintOrder id={order?._id as Id<"orders">} />}
      </ScrollView>
    </View>
  );
};

export default OrderDetails;
