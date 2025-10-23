import {useAuth} from "@clerk/clerk-expo";
import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "convex/react";
import {useRouter} from "expo-router";
import {useCallback} from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import BoxedIcon from "@/components/ui/boxed-icon";
import {api} from "@/convex/_generated/api";

type SettingItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  onPress: () => void;
};

const Setting = () => {
  const user = useQuery(api.users.getUser);

  const isAdmin = user?.role === "admin";

  const router = useRouter();

  const theme = useColorScheme();

  const shortcuts: SettingItem[] = [
    {
      name: "My Orders",
      icon: "bag",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/my-orders"),
    },
    {
      name: "My Reviews",
      icon: "chatbubble-ellipses",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/my-reviews"),
    },
    {
      name: "Notifications",
      icon: "notifications",
      backgroundColor: "#155dfc",
      onPress: () => router.push("/notifications"),
    },
    {
      name: "Preference",
      icon: "settings",
      backgroundColor: "#155dfc",
      onPress: () => router.push("/preference"),
    },
  ];

  const adminShortcuts: SettingItem[] = [
    {
      name: "Manage Users",
      icon: "people",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/users"),
    },
    {
      name: "Manage Categories",
      icon: "flag",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/categories"),
    },
    {
      name: "Manage Products",
      icon: "bag-add",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/products"),
    },
    {
      name: "Manage Reviews",
      icon: "chatbubble-ellipses",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/reviews"),
    },
    {
      name: "Manage Orders",
      icon: "bag",
      backgroundColor: "#1D4ED8",
      onPress: () => router.push("/orders"),
    },
  ];

  const account: SettingItem[] = [
    {
      name: "Sign Out",
      icon: "log-out",
      backgroundColor: "#fc1515",
      onPress: () => handleSignOut(),
    },
    {
      name: "Delete User",
      icon: "trash",
      backgroundColor: "#fc1515",
      onPress: () => router.push("/delete-user"),
    },
    {
      name: "About Application",
      icon: "information",
      backgroundColor: "#00c304",
      onPress: () => router.push("/about-application"),
    },
    {
      name: "Help",
      icon: "help",
      backgroundColor: "#00c304",
      onPress: () => router.push("/help"),
    },
  ];

  const {signOut} = useAuth();

  const handleSignOut = useCallback(() => {
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
  }, [signOut]);

  const renderSettingItem: ListRenderItem<SettingItem> = useCallback(
    ({item}) => (
      <TouchableOpacity
        className="flex-row items-center p-2.5 gap-2.5"
        onPress={item.onPress}
      >
        <BoxedIcon name={item.icon} backgroundColor={item.backgroundColor} />
        <Text className="text-xl flex-1 dark:text-white">{item.name}</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>
    ),
    [theme]
  );

  const ItemSeparatorComponent = useCallback(
    () => <View className="ml-12 border-b-[#bbb] border-b-2" />,
    []
  );

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{paddingBottom: 40}}
      >
        <View className="bg-white rounded-md mx-4 mt-5 dark:bg-gray-800">
          <FlatList
            data={shortcuts}
            scrollEnabled={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={renderSettingItem}
            keyExtractor={(item) => item.name}
          />
        </View>
        {isAdmin && (
          <View className="bg-white rounded-md mx-4 mt-5 dark:bg-gray-800">
            <FlatList
              data={adminShortcuts}
              scrollEnabled={false}
              ItemSeparatorComponent={ItemSeparatorComponent}
              renderItem={renderSettingItem}
              keyExtractor={(item) => item.name}
            />
          </View>
        )}
        <View className="bg-white rounded-md mx-4 mt-5 dark:bg-gray-800">
          <FlatList
            data={account}
            scrollEnabled={false}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={renderSettingItem}
            keyExtractor={(item) => item.name}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Setting;
