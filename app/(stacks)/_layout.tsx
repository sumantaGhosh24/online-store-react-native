import {Ionicons} from "@expo/vector-icons";
import {Stack, router} from "expo-router";
import {TouchableOpacity} from "react-native";
import {useQuery} from "convex/react";

import {Colors} from "@/constant/colors";
import DropdownPlus from "@/components/ui/dropdown-plus";
import {api} from "@/convex/_generated/api";

const StackLayout = () => {
  const user = useQuery(api.users.getUser);

  if (user === undefined) {
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <>
      <Stack
        screenOptions={{
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
      >
        <Stack.Screen
          name="address/manage"
          options={{
            title: "Addresses",
            presentation: "formSheet",
            headerRight: () => (
              <DropdownPlus text="Create Address" href="/address/create" />
            ),
          }}
        />
        <Stack.Screen
          name="address/create"
          options={{
            presentation: "formSheet",
            title: "",
            sheetAllowedDetents: [0.5, 0.75, 0.9],
            sheetGrabberVisible: false,
            sheetCornerRadius: 10,
            headerShown: false,
            sheetExpandsWhenScrolledToEdge: false,
          }}
        />
        <Stack.Screen
          name="address/update/[id]"
          options={{
            presentation: "formSheet",
            title: "",
            sheetAllowedDetents: [0.5, 0.75, 0.9],
            sheetGrabberVisible: false,
            sheetCornerRadius: 10,
            headerShown: false,
            sheetExpandsWhenScrolledToEdge: false,
          }}
        />

        <Stack.Screen
          name="update-user"
          options={{presentation: "formSheet", title: "Update User"}}
        />
        <Stack.Screen
          name="update-user-information"
          options={{
            presentation: "formSheet",
            title: "Update User Information",
          }}
        />
        <Stack.Screen
          name="update-user-image"
          options={{presentation: "formSheet", title: "Update User Image"}}
        />

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
