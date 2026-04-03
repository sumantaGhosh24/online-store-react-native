import {TouchableOpacity} from "react-native";
import {useQuery} from "convex/react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import {api} from "@/convex/_generated/api";
import {useAuthStore} from "@/store";

export const AdminToggleButton = () => {
  const user = useQuery(api.users.getUser);
  const {mode, enterAdminMode, exitAdminMode} = useAuthStore();

  if (user?.role !== "admin") return null;

  const isAdminMode = mode === "admin";

  return (
    <TouchableOpacity
      onPress={isAdminMode ? exitAdminMode : enterAdminMode}
      style={{marginRight: 16}}
    >
      {isAdminMode ? (
        <FontAwesome6 name="user-large" size={24} color="white" />
      ) : (
        <FontAwesome6 name="user-shield" size={24} color="white" />
      )}
    </TouchableOpacity>
  );
};
