import {type PropsWithChildren} from "react";

type StripeProviderProps = PropsWithChildren<{
  publishableKey: string;
}>;

const AppStripeProvider = ({children}: StripeProviderProps) => {
  return children;
};

export default AppStripeProvider;
