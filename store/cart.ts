import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

import {Id} from "@/convex/_generated/dataModel";

const isWeb = Platform.OS === "web";

interface Product {
  _id: Id<"products">;
  quantity: number;
}

export interface CartState {
  products: Product[];
  addProduct: (productId: Id<"products">) => void;
  reduceProduct: (productId: Id<"products">) => void;
  removeProduct: (productId: Id<"products">) => void;
  coupon: Id<"coupons"> | null;
  setCoupon: (couponId: Id<"coupons">) => void;
  removeCoupon: () => void;
  address: Id<"addresses"> | null;
  setAddress: (addressId: Id<"addresses">) => void;
  removeAddress: () => void;
  count: number;
  clearCart: () => void;
}

const INITIAL_STATE = {
  products: [],
  coupon: null,
  address: null,
  count: 0,
};

function recalculate(products: Product[]) {
  const count = products.reduce((sum, a) => sum + a.quantity, 0);
  return {count};
}

export const useCartStore = create(
  persist<CartState>(
    (set) => ({
      ...INITIAL_STATE,
      addProduct: (productId) => {
        set((state) => {
          let found = false;
          const products = state.products.map((a) => {
            if (a._id === productId) {
              found = true;
              return {...a, quantity: a.quantity + 1};
            }
            return a;
          });
          const newProducts = found
            ? products
            : [...state.products, {_id: productId, quantity: 1}];
          const {count} = recalculate(newProducts);
          return {products: newProducts, count};
        });
      },
      reduceProduct: (productId) => {
        set((state) => {
          const products = state.products
            .map((a) =>
              a._id === productId ? {...a, quantity: a.quantity - 1} : a,
            )
            .filter((a) => a.quantity > 0);
          const {count} = recalculate(products);
          return {products, count};
        });
      },
      removeProduct: (productId) => {
        set((state) => {
          const products = state.products.filter((a) => a._id !== productId);
          const {count} = recalculate(products);
          return {products, count};
        });
      },
      setCoupon: (coupon) => set({coupon}),
      removeCoupon: () => set({coupon: null}),
      setAddress: (address) => set({address}),
      removeAddress: () => set({address: null}),
      clearCart: () => set(INITIAL_STATE),
    }),
    {
      name: "cart",
      storage: isWeb
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => ({
            setItem: (key: string, value: string) =>
              SecureStore.setItemAsync(key, value),
            getItem: (key: string) => SecureStore.getItemAsync(key),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          })),
    },
  ),
);
