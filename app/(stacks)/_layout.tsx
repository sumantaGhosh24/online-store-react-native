import {useQuery} from "convex/react";
import {Stack} from "expo-router";

import {api} from "@/convex/_generated/api";

const StackLayout = () => {
  const user = useQuery(api.users.getUser);

  const isAdmin = user?.role === "admin";

  return (
    <>
      <Stack>
        <Stack.Screen
          name="product/details/[id]"
          options={{title: "Product Details"}}
        />

        <Stack.Screen
          name="order/details/[id]"
          options={{title: "Order Details"}}
        />

        <Stack.Screen name="checkout" options={{title: "Checkout"}} />

        <Stack.Screen name="preference" options={{title: "Preference"}} />
        <Stack.Screen name="help" options={{title: "Help"}} />
        <Stack.Screen
          name="about-application"
          options={{title: "About Application"}}
        />
        <Stack.Screen name="delete-user" options={{title: "Delete User"}} />

        <Stack.Protected guard={isAdmin}>
          <Stack.Screen
            name="category/create"
            options={{title: "Create Category"}}
          />
          <Stack.Screen
            name="category/update/[id]"
            options={{title: "Update Category"}}
          />

          <Stack.Screen
            name="product/create"
            options={{title: "Create Product"}}
          />
          <Stack.Screen
            name="product/update/[id]"
            options={{title: "Update Product"}}
          />

          <Stack.Screen
            name="coupon/create"
            options={{title: "Create Coupon"}}
          />
          <Stack.Screen
            name="coupon/update/[id]"
            options={{title: "Update Coupon"}}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export default StackLayout;
