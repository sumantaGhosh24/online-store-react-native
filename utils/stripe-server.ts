import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2025-09-30.clover",
  appInfo: {
    name: "expo-router-stripe",
  },
});
