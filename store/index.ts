import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

const isWeb = Platform.OS === "web";

type UserState = {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: () => void;
  resetOnboarding: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: () => set({hasCompletedOnboarding: true}),
      resetOnboarding: () => set({hasCompletedOnboarding: false}),
      _hasHydrated: false,
      setHasHydrated: (value) => set({_hasHydrated: value}),
    }),
    {
      name: "auth-store",
      storage: isWeb
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => ({
            setItem: (key: string, value: string) =>
              SecureStore.setItemAsync(key, value),
            getItem: (key: string) => SecureStore.getItemAsync(key),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          })),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true);
        };
      },
    },
  ),
);
