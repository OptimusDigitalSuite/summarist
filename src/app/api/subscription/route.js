import { NextResponse } from "next/server";
import { getStripe, planForPrice } from "@/lib/stripe";

// Reads a user's subscription state back out of Stripe.
//
// The alternative is webhooks, which need a publicly reachable URL and a
// signing secret — awkward on localhost. Asking Stripe directly is a request
// per page load instead of a push, which is the right trade at this size.
export async function GET(request) {
  const uid = new URL(request.url).searchParams.get("uid");
  if (!uid) return NextResponse.json({ plan: null });

  try {
    const stripe = getStripe();

    // Checkout sessions carry client_reference_id; subscriptions do not, so the
    // session is the link between a Firebase uid and a Stripe subscription.
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const mine = sessions.data.filter(
      (s) => s.client_reference_id === uid && s.subscription
    );
    if (!mine.length) return NextResponse.json({ plan: null });

    for (const session of mine) {
      const subscription = await stripe.subscriptions.retrieve(
        typeof session.subscription === "string" ? session.subscription : session.subscription.id
      );
      // "trialing" counts as subscribed — that is the whole point of the
      // 7-day trial the documentation asks for.
      if (["active", "trialing"].includes(subscription.status)) {
        const priceId = subscription.items.data[0]?.price?.id;
        return NextResponse.json({ plan: planForPrice(priceId), status: subscription.status });
      }
    }

    return NextResponse.json({ plan: null });
  } catch (error) {
    return NextResponse.json({ plan: null, error: error.message });
  }
}
