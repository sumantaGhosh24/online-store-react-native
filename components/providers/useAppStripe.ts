type StripeError = {
  message: string;
};

type StripeResult = {
  error?: StripeError;
};

type InitPaymentSheetParams = Record<string, unknown>;

export const useAppStripe = () => {
  return {
    initPaymentSheet: async (
      _params: InitPaymentSheetParams,
    ): Promise<StripeResult> => ({
      error: {message: "Stripe is not available on web/server builds."},
    }),
    presentPaymentSheet: async (): Promise<StripeResult> => ({
      error: {message: "Stripe is not available on web/server builds."},
    }),
  };
};
