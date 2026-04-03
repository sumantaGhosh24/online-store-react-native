import {useAuth} from "@clerk/clerk-expo";
import {Ionicons} from "@expo/vector-icons";
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

type SettingItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  onPress: () => void;
};

const Setting = () => {
  const router = useRouter();

  const theme = useColorScheme();

  const account: SettingItem[] = [
    {
      name: "Prference",
      icon: "accessibility",
      backgroundColor: "#155dfc",
      onPress: () => router.push("/preference"),
    },
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
      backgroundColor: "#155dfc",
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
              50,
            );
          },
        },
      ],
      {cancelable: true},
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
    [theme],
  );

  const ItemSeparatorComponent = useCallback(
    () => <View className="ml-12 border-b-[#bbb] border-b-2" />,
    [],
  );

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{paddingBottom: 40}}
      >
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
