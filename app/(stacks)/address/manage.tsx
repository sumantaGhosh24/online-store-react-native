import {useQuery} from "convex/react";
import {FlatList} from "react-native";
import {router} from "expo-router";

import {api} from "@/convex/_generated/api";
import Address from "@/components/users/address";
import EmptyState from "@/components/ui/empty-state";

const UserAddresses = () => {
  const addresses = useQuery(api.addresses.getAddresses);

  return (
    <FlatList
      data={addresses}
      renderItem={({item, index}) => <Address {...item} index={index} />}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={{paddingBottom: 20}}
      ListEmptyComponent={() => (
        <EmptyState
          title="No addresses found"
          subtitle="Create an address"
          buttonTitle="Create"
          handlePress={() => router.push("/address/create")}
        />
      )}
    />
  );
};

export default UserAddresses;
