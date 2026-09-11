import Stripe from "stripe";

// Server-only. STRIPE_SECRET_KEY has no NEXT_PUBLIC_ prefix, so importing this
// from a client component is a build error rather than a leaked key.
let stripe;

export function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing from .env.local");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export const PRICES = {
  yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY,
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY,
};

// Which plan a price id corresponds to, for reading a subscription back.
export function planForPrice(priceId) {
  if (priceId === PRICES.yearly) return "premium-plus";
  if (priceId === PRICES.monthly) return "premium";
  return null;
}
