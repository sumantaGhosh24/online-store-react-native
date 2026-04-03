import {useStripe} from "@stripe/stripe-react-native";
import {useMutation, useQuery} from "convex/react";
import * as Linking from "expo-linking";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {Text, ToastAndroid, TouchableOpacity, View} from "react-native";

import CartCoupon from "@/components/cart/cart-coupon";
import CartAddress from "@/components/cart/cart-address";
import {api} from "@/convex/_generated/api";
import {useCartStore} from "@/store/cart";
import {Id} from "@/convex/_generated/dataModel";

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
  const {products, count, coupon, removeCoupon, address, clearCart} =
    useCartStore();

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

  const addressData = useQuery(api.addresses.getAddress, {
    id: address ?? "",
  });

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, paymentId} =
      await fetchPaymentSheetParams({
        customerId: user?.customerId,
        customerName: user?.name,
        customerEmail: user?.email,
        customerCity: addressData?.city,
        customerState: addressData?.state,
        customerCountry: addressData?.country,
        customerPostalCode: addressData?.zip,
        customerLine1: addressData?.addressline,
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
          country: addressData?.country,
          city: addressData?.city,
          state: addressData?.state,
          line1: addressData?.addressline,
          postalCode: addressData?.zip,
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
    setLoading(true);

    const {error} = await presentPaymentSheet();

    if (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
      setLoading(false);
    } else {
      const orderId = await createPayment({
        products: products,
        amount: data?.total!,
        couponId: coupon ?? "",
        paymentId: paymentId,
        addressId: addressData?._id as Id<"addresses">,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Payment successful",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
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
        city: addressData?.city,
        state: addressData?.state,
        country: addressData?.country,
        zip: addressData?.zip,
        addressline: addressData?.addressline,
      });

      removeCoupon();
      clearCart();
      setLoading(false);

      router.push("/cart");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  if (count < 1) return;

  return (
    <View className="p-3">
      {!!products.length && (
        <>
          {coupon && <CartCoupon setDiscount={setDiscount} checkout={true} />}
          {address && <CartAddress checkout={true} />}
          <View className="p-4 pt-10 bg-white dark:bg-gray-800">
            <Text className="text-base font-semibold mb-3 dark:text-white">
              Order Summary
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-500 dark:text-gray-300">
                Subtotal
              </Text>
              <Text className="text-sm font-semibold dark:text-white">
                ₹{data?.total}
              </Text>
            </View>
            {coupon && discount > 0 && (
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-primary">Discount</Text>
                <Text className="text-sm font-semibold text-primary">
                  - ₹{discount}
                </Text>
              </View>
            )}
            <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-2" />
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-bold dark:text-white">Total</Text>
              <Text className="text-xl font-bold text-primary">
                ₹
                {coupon && discount > 0 ? data?.total! - discount : data?.total}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-full py-4 items-center disabled:bg-primary/60"
              onPress={makePayment}
              disabled={!loading}
            >
              <Text className="text-lg font-bold text-white">
                {loading ? "Proceed to Checkout" : "Processing..."}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Checkout;
