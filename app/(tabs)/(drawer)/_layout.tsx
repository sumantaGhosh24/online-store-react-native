import {useClerk} from "@clerk/clerk-expo";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {Drawer} from "expo-router/drawer";
import {Alert, ToastAndroid} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useQuery} from "convex/react";
import {Stack} from "expo-router";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";

const DrawerLayout = () => {
  const user = useQuery(api.users.getUser);

  const {signOut} = useClerk();

  if (user === undefined) {
    return null;
  }

  const isAdmin = user.role === "admin";

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
                50,
              );
            },
          },
        ],
        {cancelable: true},
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
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
          headerTintColor: "#fff",
        }}
      >
        <Drawer.Screen
          name="home"
          options={{drawerLabel: "Home", title: "Home"}}
        />
        <Drawer.Screen
          name="my-reviews"
          options={{drawerLabel: "My Reviews", title: "My Reviews"}}
        />
        <Drawer.Screen
          name="my-orders"
          options={{drawerLabel: "My Orders", title: "My Orders"}}
        />

        <Stack.Protected guard={isAdmin}>
          <Drawer.Screen
            name="products"
            options={{
              drawerLabel: "Manage Products",
              title: "Manage Products",
              headerRight: () => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ padding: 5 }}
                  onPress={() => router.push("/product/create")}
                >
                  <Ionicons name="add" size={32} color={"#fff"} />
                </TouchableOpacity>
              ),
            }}
          />
          <Drawer.Screen
            name="categories"
            options={{
              drawerLabel: "Manage Categories",
              title: "Manage Categories",
              headerRight: () => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ padding: 5 }}
                  onPress={() => router.push("/category/create")}
                >
                  <Ionicons name="add" size={32} color={"#fff"} />
                </TouchableOpacity>
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ padding: 5 }}
                  onPress={() => router.push("/coupon/create")}
                >
                  <Ionicons name="add" size={32} color={"#fff"} />
                </TouchableOpacity>
              ),
            }}
          />
          <Drawer.Screen
            name="orders"
            options={{drawerLabel: "Manage Orders", title: "Manage Orders"}}
          />
        </Stack.Protected>
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
