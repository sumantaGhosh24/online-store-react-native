import {ClerkLoaded, ClerkProvider, useAuth, useUser} from "@clerk/clerk-expo";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {FontAwesome} from "@expo/vector-icons";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import {StripeProvider} from "@stripe/stripe-react-native";
import {ConvexReactClient} from "convex/react";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {useFonts} from "expo-font";
import * as Linking from "expo-linking";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
import {Fragment, useEffect} from "react";
import {LogBox, useColorScheme} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";

import "react-native-reanimated";
import "react-native-url-polyfill/auto";

import {useAuthStore} from "@/store";

import "@/global.css";

export {ErrorBoundary} from "expo-router";

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}
LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys."]);

const publishableStripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!publishableStripeKey) {
  throw new Error(
    "Missing Publishable Stripe Key. Please set EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env"
  );
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const {hasCompletedOnboarding, _hasHydrated} = useAuthStore();

  const user = useUser();
  const {isSignedIn} = useAuth();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (_hasHydrated && loaded) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated, loaded]);

  useEffect(() => {
    if (user && user.user) {
      Sentry.setUser({
        email: user.user.emailAddresses[0].emailAddress,
        id: user.user.id,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  if (!_hasHydrated || !loaded) {
    return null;
  }

  return (
    <Fragment>
      <Stack>
        <Stack.Protected guard={isSignedIn as boolean}>
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          <Stack.Screen name="(stacks)" options={{headerShown: false}} />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn && hasCompletedOnboarding}>
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
        </Stack.Protected>
        <Stack.Protected guard={!hasCompletedOnboarding}>
          <Stack.Screen name="index" options={{headerShown: false}} />
        </Stack.Protected>
      </Stack>
      <StatusBar hidden />
    </Fragment>
  );
};

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <StripeProvider
            publishableKey={publishableStripeKey}
            urlScheme={Linking.createURL("/").split(":")[0]}
          >
            <GestureHandlerRootView style={{flex: 1}}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <InitialLayout />
              </ThemeProvider>
            </GestureHandlerRootView>
          </StripeProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
});
