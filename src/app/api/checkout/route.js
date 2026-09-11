import { NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/stripe";

// Creates a Stripe Checkout Session and hands back its URL. The secret key
// never leaves the server; the browser only ever sees the redirect target.
export async function POST(request) {
  try {
    const { plan, uid, email } = await request.json();

    const price = PRICES[plan];
    if (!price) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }
    if (!uid) {
      return NextResponse.json({ error: "Sign in first" }, { status: 401 });
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      // Ties the Stripe customer back to the Firebase user, which is how the
      // subscription route finds it again afterwards.
      client_reference_id: uid,
      customer_email: email || undefined,
      success_url: `${origin}/settings?checkout=success`,
      cancel_url: `${origin}/choose-plan?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
