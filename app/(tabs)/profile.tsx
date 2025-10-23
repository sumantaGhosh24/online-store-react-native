import {useQuery} from "convex/react";
import {useCallback, useState} from "react";
import {Image, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import SegmentedControl from "@/components/ui/segmented-control";
import UpdateUser from "@/components/users/update-user";
import UpdateUserImage from "@/components/users/update-user-image";
import UpdateUserInformation from "@/components/users/update-user-information";
import UserDetails from "@/components/users/user-details";
import {api} from "@/convex/_generated/api";

const Profile = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = useCallback((index: number) => {
    setTabIndex(index);
  }, []);

  const user = useQuery(api.users.getUser);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView className="px-3">
        <View>
          <Image
            source={{uri: user?.image as any}}
            className="h-24 w-24 rounded-full my-4"
          />
          <Text className="text-xl mb-4 dark:text-white font-bold capitalize">
            {user?.name}
          </Text>
          <Text className="text-lg mb-4 dark:text-white font-medium">
            {user?.email}
          </Text>
          <Text className="text-base mb-4 dark:text-white">
            User since:{" "}
            {new Date(user?._creationTime as any).toLocaleDateString()}
          </Text>
        </View>
        <SegmentedControl
          tabs={[
            "Details",
            "Update User",
            "Update Information",
            "Update Image",
          ]}
          currentIndex={tabIndex}
          onChange={handleTabsChange}
          segmentedControlBackgroundColor="#fff"
          activeSegmentBackgroundColor="#1D4ED8"
          textColor="#000"
          activeTextColor="#fff"
          paddingVertical={10}
        />
        {tabIndex === 0 && <UserDetails />}
        {tabIndex === 1 && <UpdateUser />}
        {tabIndex === 2 && <UpdateUserInformation />}
        {tabIndex === 3 && <UpdateUserImage />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
