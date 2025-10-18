import {useClerk} from "@clerk/clerk-expo";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {useQuery} from "convex/react";
import {Stack} from "expo-router";
import {Drawer} from "expo-router/drawer";
import {Alert, ToastAndroid} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";

import DropdownPlus from "@/components/dropdown-plus";
import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";

const DrawerLayout = () => {
  const {signOut} = useClerk();

  const user = useQuery(api.users.getUser);

  const isAdmin = user?.role === "admin";

  const handleSignOut = async () => {
    try {
      Alert.alert(
        "Sign Out",
        "Do you really want to sign out?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign Out",
            style: "destructive",
            onPress: async () => {
              await signOut();

              ToastAndroid.showWithGravityAndOffset(
                "You have been signed out",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            },
          },
        ],
        {cancelable: true}
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        initialRouteName="home"
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem label="Logout" onPress={handleSignOut} />
            </DrawerContentScrollView>
          );
        }}
        screenOptions={{
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
        }}
      >
        <Drawer.Screen
          name="home"
          options={{drawerLabel: "Home", title: "Home"}}
        />
        <Stack.Protected guard={isAdmin}>
          <Drawer.Screen
            name="users"
            options={{drawerLabel: "Manage Users", title: "Manage Users"}}
          />
          <Drawer.Screen
            name="categories"
            options={{
              drawerLabel: "Manage Categories",
              title: "Manage Categories",
              headerRight: () => (
                <DropdownPlus text="Create Category" href="/category/create" />
              ),
            }}
          />
          <Drawer.Screen
            name="products"
            options={{
              drawerLabel: "Manage Products",
              title: "Manage Products",
              headerRight: () => (
                <DropdownPlus text="Create Product" href="/product/create" />
              ),
            }}
          />
          <Drawer.Screen
            name="reviews"
            options={{drawerLabel: "Manage Reviews", title: "Manage Reviews"}}
          />
          <Drawer.Screen
            name="coupons"
            options={{
              drawerLabel: "Manage Coupons",
              title: "Manage Coupons",
              headerRight: () => (
                <DropdownPlus text="Create Coupon" href="/coupon/create" />
              ),
            }}
          />
          <Drawer.Screen
            name="orders"
            options={{drawerLabel: "Manage Orders", title: "Manage Orders"}}
          />
        </Stack.Protected>
        <Drawer.Screen
          name="my-reviews"
          options={{drawerLabel: "My Reviews", title: "My Reviews"}}
        />
        <Drawer.Screen
          name="my-orders"
          options={{drawerLabel: "My Orders", title: "My Orders"}}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
