import {stripe} from "@/utils/stripe-server";

export async function POST(req: Request) {
  const {
    customerId,
    customerName,
    customerEmail,
    customerCity,
    customerState,
    customerCountry,
    customerPostalCode,
    customerLine1,
    amount,
  } = await req.json();

  let customer;
  if (customerId) {
    customer = await stripe.customers.retrieve(customerId);
  } else {
    customer = await stripe.customers.create({
      name: customerName,
      email: customerEmail,
      address: {
        city: customerCity,
        country: customerCountry,
        line1: customerLine1,
        postal_code: customerPostalCode,
        state: customerState,
      },
    });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: "2025-09-30.clover"}
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
    description: "Payment for online store products",
  });

  return Response.json({
    paymentIntent: paymentIntent.client_secret,
    paymentId: paymentIntent.id,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
}
