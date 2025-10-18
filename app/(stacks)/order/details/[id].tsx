import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "convex/react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";

import PrintOrder from "@/components/print-order";
import UpdateOrder from "@/components/update-order";
import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const OrderDetails = () => {
  const {id} = useLocalSearchParams();

  const order = useQuery(api.orders.getOrder, {id: id as Id<"orders">});

  const user = useQuery(api.users.getUser);
  const isAdmin = user?.role === "admin";

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Order Details",
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          headerLeft: () => (
            <TouchableOpacity
              className="items-center justify-center mr-5"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <ScrollView>
          <View className="p-3">
            <View className="flex flex-row items-center justify-between bg-gray-300 dark:bg-gray-800 px-2 py-3">
              <Text className="text-xl font-bold dark:text-white w-[50%]">
                Product
              </Text>
              <Text className="text-xl font-bold dark:text-white w-[25%] text-center">
                Quantity
              </Text>
              <Text className="text-xl font-bold dark:text-white w-[25%] text-center">
                Price
              </Text>
            </View>
            {order?.orderItems.map((item) => (
              <View
                key={item?.product?._id}
                className="flex flex-row items-center justify-between bg-gray-200 dark:bg-gray-700 p-2"
              >
                <Text className="text-lg capitalize dark:text-white w-[50%]">
                  {item?.product?.title}
                </Text>
                <Text className="text-lg dark:text-white w-[25%] text-center">
                  {item?.quantity}
                </Text>
                <Text className="text-lg dark:text-white w-[25%] text-center">
                  ₹{item?.product?.price}
                </Text>
              </View>
            ))}
            <View className="flex flex-row items-center gap-2 my-3">
              <Text className="text-xl font-bold dark:text-white">
                User name:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {order?.user?.name}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                User email:
              </Text>
              <Text className="text-lg dark:text-white">
                {order?.user?.email}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                User username:
              </Text>
              <Text className="text-lg dark:text-white">
                {order?.user?.username}
              </Text>
            </View>
            {order?.coupon?.name !== "" && (
              <>
                <View className="flex flex-row items-center gap-2 mb-3">
                  <Text className="text-xl font-bold dark:text-white">
                    Coupon ID:
                  </Text>
                  <Text className="text-lg dark:text-white">
                    {order?.coupon?._id}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2 mb-3">
                  <Text className="text-xl font-bold dark:text-white">
                    Coupon name:
                  </Text>
                  <Text className="text-lg dark:text-white">
                    {order?.coupon?.name}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2 mb-3">
                  <Text className="text-xl font-bold dark:text-white">
                    Coupon code:
                  </Text>
                  <Text className="text-lg dark:text-white uppercase">
                    {order?.coupon?.code}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2 mb-3">
                  <Text className="text-xl font-bold dark:text-white">
                    Coupon discount:
                  </Text>
                  <Text className="text-lg dark:text-white">
                    ₹{order?.coupon?.discount}
                  </Text>
                </View>
              </>
            )}
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Shipping city:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {order?.shippingAddress?.city}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Shipping state:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {order?.shippingAddress?.state}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Shipping country:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {order?.shippingAddress?.country}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Shipping zip:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {order?.shippingAddress?.zip}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Shipping address:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {order?.shippingAddress?.address}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Payment status:
              </Text>
              <Text className="text-lg dark:text-white uppercase">
                {order?.paymentStatus}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">Price:</Text>
              <Text className="text-lg dark:text-white">₹{order?.price}</Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Discount:
              </Text>
              <Text className="text-lg dark:text-white">
                ₹{order?.discount}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Final price:
              </Text>
              <Text className="text-lg dark:text-white">
                ₹{order?.finalPrice}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2 mb-3">
              <Text className="text-xl font-bold dark:text-white">
                Paid at:
              </Text>
              <Text className="text-lg dark:text-white capitalize">
                {new Date(order?.paidAt as any).toLocaleDateString()}
              </Text>
            </View>
            {order?.isDelivered && (
              <View className="flex flex-row items-center gap-2 mb-3">
                <Text className="text-xl font-bold dark:text-white">
                  Deliver at:
                </Text>
                <Text className="text-lg dark:text-white capitalize">
                  {new Date(order?.deliveredAt as any).toLocaleDateString()}
                </Text>
              </View>
            )}
            {!order?.isDelivered && isAdmin && (
              <UpdateOrder id={order?._id as Id<"orders">} />
            )}
            {order?.isDelivered && (
              <PrintOrder id={order?._id as Id<"orders">} />
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default OrderDetails;
