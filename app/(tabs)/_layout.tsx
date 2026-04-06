import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import {Stack, Tabs} from "expo-router";
import {Text, View} from "react-native";
import {useQuery} from "convex/react";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {useCartStore} from "@/store/cart";
import {api} from "@/convex/_generated/api";

const TabLayout = () => {
  const user = useQuery(api.users.getUser);

  const {count} = useCartStore();

  const insets = useSafeAreaInsets();

  if (user === undefined) {
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerStyle: {backgroundColor: "#1D4ED8"},
        headerTitleStyle: {color: "#fff", fontWeight: "600"},
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#1D4ED8",
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({color, size, focused}) =>
            focused ? (
              <FontAwesome name="home" size={size} color={color} />
            ) : (
              <AntDesign name="home" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({color, size, focused}) =>
            focused ? (
              <FontAwesome name="user" size={size} color={color} />
            ) : (
              <FontAwesome name="user-o" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({color, size, focused}) => (
            <View className="relative">
              {focused ? (
                <Ionicons name="cart" color={color} size={size} />
              ) : (
                <Ionicons name="cart-outline" color={color} size={size} />
              )}
              {count > 0 && (
                <View className="absolute -top-2 -right-3 bg-red-500 rounded-full min-w-[16px] h-4 px-[2px] justify-center items-center">
                  <Text className="text-[10px] text-white font-bold">
                    {count > 9 ? "9+" : count}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Stack.Protected guard={isAdmin}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({color, size, focused}) =>
              focused ? (
                <FontAwesome name="dashboard" size={size} color={color} />
              ) : (
                <AntDesign name="dashboard" size={size} color={color} />
              ),
          }}
        />
      </Stack.Protected>
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: ({color, size, focused}) =>
            focused ? (
              <Ionicons name="settings" size={size} color={color} />
            ) : (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
