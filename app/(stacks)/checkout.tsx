import {Ionicons} from "@expo/vector-icons";
import {useStripe} from "@stripe/stripe-react-native";
import {useMutation, useQuery} from "convex/react";
import * as Linking from "expo-linking";
import {router, Stack} from "expo-router";
import {useEffect, useState} from "react";
import {Text, ToastAndroid, TouchableOpacity, View} from "react-native";

import CartCoupon from "@/components/cart-coupon";
import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {useCartStore} from "@/store/cart";

interface FetchPaymentSheetParams {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerCity?: string;
  customerState?: string;
  customerCountry?: string;
  customerPostalCode?: string;
  customerLine1?: string;
  amount?: number;
}

async function fetchPaymentSheetParams({
  customerId,
  customerName,
  customerEmail,
  customerCity,
  customerState,
  customerCountry,
  customerPostalCode,
  customerLine1,
  amount,
}: FetchPaymentSheetParams): Promise<{
  paymentIntent: string;
  paymentId: string;
  ephemeralKey: string;
  customer: string;
}> {
  return fetch(`/api/payment-sheet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId,
      customerName,
      customerEmail,
      customerCity,
      customerState,
      customerCountry,
      customerPostalCode,
      customerLine1,
      amount,
    }),
  }).then((res) => res.json());
}

interface SendEmailParams {
  email?: string;
  userName?: string;
  orderId?: string;
  orderDate?: string;
  paymentStatus?: string;
  userEmail?: string;
  products?: any;
  subtotal?: number;
  couponCode?: string;
  discount?: number;
  finalPrice?: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  addressline?: string;
}

async function sendEmail({
  email,
  userName,
  orderId,
  orderDate,
  paymentStatus,
  userEmail,
  products,
  subtotal,
  couponCode,
  discount,
  finalPrice,
  city,
  state,
  country,
  zip,
  addressline,
}: SendEmailParams) {
  return fetch(`/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      userName,
      orderId,
      orderDate,
      paymentStatus,
      userEmail,
      products,
      subtotal,
      couponCode,
      discount,
      finalPrice,
      city,
      state,
      country,
      zip,
      addressline,
    }),
  }).then((res) => res.json());
}

const Checkout = () => {
  const {products, count, coupon, removeCoupon, clearCart} = useCartStore();

  const data = useQuery(api.payments.calculateCartTotal, {products});

  const user = useQuery(api.users.getUser);

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentId, setPaymentId] = useState("");

  const createStripeAccount = useMutation(api.payments.createStripeAccount);

  const couponData = useQuery(api.coupons.getCoupon, {
    id: coupon ?? "",
  });

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, paymentId} =
      await fetchPaymentSheetParams({
        customerId: user?.customerId,
        customerName: user?.name,
        customerEmail: user?.email,
        customerCity: user?.city,
        customerState: user?.state,
        customerCountry: user?.country,
        customerPostalCode: user?.zip,
        customerLine1: user?.addressline,
        amount: couponData ? data?.total! - couponData?.discount : data?.total,
      });

    if (!user?.customerId) {
      await createStripeAccount({customerId: customer});
    }

    setPaymentId(paymentId);

    const {error} = await initPaymentSheet({
      merchantDisplayName: "Online Store",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: user?.name,
        email: user?.email,
        phone: user?.mobileNumber || "",
        address: {
          country: user?.country || "",
          city: user?.city || "",
          state: user?.state || "",
          line1: user?.addressline || "",
          postalCode: user?.zip || "",
        },
      },
      returnURL: Linking.createURL("stripe-redirect"),
    });
    if (!error) {
      setLoading(true);
    }
  };

  const createPayment = useMutation(api.payments.createPayment);

  const makePayment = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );
    } else {
      const orderId = await createPayment({
        products: products,
        amount: data?.total!,
        couponId: coupon ?? "",
        paymentId: paymentId,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Payment successful",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100
      );

      await sendEmail({
        email: user?.email,
        userName: user?.name,
        orderId: orderId,
        orderDate: new Date().toLocaleDateString(),
        paymentStatus: "completed",
        userEmail: user?.email,
        products: data?.orderItems,
        subtotal: data?.total,
        couponCode: couponData ? couponData?.code : "",
        discount: couponData ? couponData?.discount : 0,
        finalPrice: couponData
          ? data?.total! - couponData?.discount
          : data?.total!,
        city: user?.city ?? "",
        state: user?.state ?? "",
        country: user?.country ?? "",
        zip: user?.zip ?? "",
        addressline: user?.addressline ?? "",
      });

      removeCoupon();
      clearCart();

      router.push("/cart");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  if (count < 1) return;

  return (
    <View>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
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
      {!!products.length && (
        <>
          {coupon && <CartCoupon setDiscount={setDiscount} checkout={true} />}
          <View className="p-4 pt-10 bg-white dark:bg-gray-800">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold dark:text-white">
                Subtotal
              </Text>
              <View>
                {coupon && discount > 0 ? (
                  <View className="flex-row items-center gap-2">
                    <Text className="text-2xl font-bold dark:text-white">
                      ₹{data?.total! - discount}
                    </Text>
                    <Text className="line-through dark:text-white">
                      ₹{data?.total}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-2xl font-bold dark:text-white">
                    ₹{data?.total}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-full py-4 items-center disabled:bg-primary/60"
              onPress={makePayment}
              disabled={!loading}
            >
              <Text className="text-lg font-bold text-white">
                {!loading ? "Wait..." : "Checkout"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Checkout;
