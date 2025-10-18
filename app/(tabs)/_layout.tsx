import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {useQuery} from "convex/react";
import {Stack, Tabs} from "expo-router";
import {Text, View} from "react-native";

import {Colors} from "@/constant/colors";
import {api} from "@/convex/_generated/api";
import {useCartStore} from "@/store/cart";

const TabLayout = () => {
  const user = useQuery(api.users.getUser);

  const isAdmin = user?.role === "admin";

  const {count} = useCartStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#1D4ED8",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Stack.Protected guard={isAdmin}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShadowVisible: false,
            headerStyle: {backgroundColor: Colors.background},
            headerTitleStyle: {color: "white"},
            tabBarIcon: ({color, size}) => (
              <FontAwesome name="dashboard" size={size} color={color} />
            ),
          }}
        />
      </Stack.Protected>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          tabBarIcon: ({color, size}) => (
            <View className="relative flex items-center justify-center gap-2">
              <Ionicons name="cart-outline" color={color} size={size} />
              <View className="absolute -top-1 h-4 w-4 -right-4">
                <Text className="text-md font-bold text-white">{count}</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          headerShadowVisible: false,
          headerStyle: {backgroundColor: Colors.background},
          headerTitleStyle: {color: "white"},
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
