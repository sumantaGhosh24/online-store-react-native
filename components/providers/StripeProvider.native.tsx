import * as Linking from "expo-linking";
import {StripeProvider} from "@stripe/stripe-react-native";
import {type PropsWithChildren} from "react";

type StripeProviderProps = PropsWithChildren<{
  publishableKey: string;
}>;

const AppStripeProvider = ({children, publishableKey}: StripeProviderProps) => {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      urlScheme={Linking.createURL("/").split(":")[0]}
    >
      <>{children}</>
    </StripeProvider>
  );
};

export default AppStripeProvider;
