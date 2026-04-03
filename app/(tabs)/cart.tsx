import {useQuery} from "convex/react";
import {Link} from "expo-router";
import {useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";

import CartApplyCoupon from "@/components/cart/cart-apply-coupon";
import CartCoupon from "@/components/cart/cart-coupon";
import CartItem from "@/components/cart/cart-item";
import CartAddress from "@/components/cart/cart-address";
import CartApplyAddress from "@/components/cart/cart-apply-address";
import EmptyCart from "@/components/cart/empty-cart";
import {api} from "@/convex/_generated/api";
import {useCartStore} from "@/store/cart";

const Cart = () => {
  const {products, count, coupon, address} = useCartStore();

  const data = useQuery(api.payments.calculateCartTotal, {products});

  const [discount, setDiscount] = useState(0);

  if (count < 1) return <EmptyCart />;

  return (
    <View>
      {!!products.length && (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({item}) => <CartItem {...item} />}
          contentContainerClassName="p-4"
          ListFooterComponent={
            <>
              {coupon ? (
                <CartCoupon setDiscount={setDiscount} />
              ) : (
                <CartApplyCoupon total={data?.total as number} />
              )}
              {address ? <CartAddress /> : <CartApplyAddress />}
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
                {address ? (
                  <Link href="/checkout" asChild>
                    <TouchableOpacity className="bg-primary rounded-full py-4 items-center">
                      <Text className="text-lg font-bold text-white">
                        Proceed to checkout ({count} item
                        {count > 1 ? "s" : ""})
                      </Text>
                    </TouchableOpacity>
                  </Link>
                ) : (
                  <Text className="dark:text-white">
                    Add addresss to checkout
                  </Text>
                )}
              </View>
            </>
          }
        />
      )}
    </View>
  );
};

export default Cart;
