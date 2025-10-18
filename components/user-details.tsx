import {useQuery} from "convex/react";
import {Text, View} from "react-native";

import {api} from "@/convex/_generated/api";

const UserDetails = () => {
  const user = useQuery(api.users.getUser);

  return (
    <View>
      {user?.mobileNumber ? (
        <>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            Mobile number: {user?.mobileNumber}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            Username: {user?.username}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            DOB: {new Date(user?.dob as any).toLocaleDateString()}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            Gender: {user?.gender}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            City: {user?.city}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            State: {user?.state}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            Country: {user?.country}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            Zip: {user?.zip}
          </Text>
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            Addressline: {user?.addressline}
          </Text>
        </>
      ) : (
        <Text className="text-xl font-bold dark:text-white mb-4">
          Update your user information
        </Text>
      )}
      {user?.role === "admin" && (
        <Text className="bg-primary text-white px-2 py-1.5 w-[60px] rounded">
          Admin
        </Text>
      )}
    </View>
  );
};

export default UserDetails;
