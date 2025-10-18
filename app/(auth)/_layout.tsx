import {Stack} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const AuthLayout = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack>
        <Stack.Screen name="register" options={{headerShown: false}} />
        <Stack.Screen name="login" options={{headerShown: false}} />
        <Stack.Screen
          name="reset"
          options={{
            title: "Forgot Password",
            headerBackButtonMenuEnabled: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthLayout;
