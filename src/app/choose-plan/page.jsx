"use client";

import { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AiFillFileText } from "react-icons/ai";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import "../home.css";
import "./plan.css";
import Footer from "@/components/home/Footer";
import Accordion from "@/components/plan/Accordion";
import { openLogin } from "@/redux/modalSlice";
import { selectIsSignedIn, selectAuthLoading } from "@/redux/userSlice";

// The sales page deliberately sits OUTSIDE the (app) route group, because the
// documentation says the sidebar and search bar appear everywhere except here
// and the home page.

const FEATURES = [
  { icon: <AiFillFileText />, title: "Key ideas in few min", sub: "with many books to read" },
  { icon: <RiLeafLine />, title: "3 million", sub: "people growing with Summarist everyday" },
  { icon: <BiCrown />, title: "Precise recommendations", sub: "collections curated by experts" },
];

const PLANS = [
  {
    id: "yearly",
    title: "Premium Plus Yearly",
    price: "$99.99/year",
    note: "7-day free trial included",
    cta: "Start your free 7-day trial",
    smallPrint: "Cancel your trial at any time before it ends, and you won’t be charged.",
  },
  {
    id: "monthly",
    title: "Premium Monthly",
    price: "$9.99/month",
    note: "No trial included",
    cta: "Start your first month",
    smallPrint: "30-day money back guarantee, no questions asked.",
  },
];

const FAQS = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with unlimited access to a wide range of best-selling books in high-quality audio and text. Our library is constantly updated, and you can enjoy everything at your own pace.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

export default function ChoosePlanPage() {
  const dispatch = useDispatch();
  const signedIn = useSelector(selectIsSignedIn);
  const authLoading = useSelector(selectAuthLoading);
  const [selected, setSelected] = useState("yearly");
  const [notice, setNotice] = useState(null);

  const plan = PLANS.find((p) => p.id === selected);

  const onSubscribe = () => {
    if (authLoading) return;
    if (!signedIn) {
      dispatch(openLogin());
      return;
    }
    // TODO: Stripe. The Firebase "Run Payments with Stripe" extension takes a
    // write to users/{uid}/checkout_sessions and returns a redirect URL; that
    // is the only piece of this page still missing.
    setNotice("Checkout is not connected yet — Stripe is the next step.");
  };

  return (
    <>
      <div className="plan">
        <div className="plan__header--wrapper">
          <div className="plan__header">
            <div className="plan__title">
              Get unlimited access to many amazing books to read
            </div>
            <div className="plan__sub--title">
              Turn ordinary moments into amazing learning opportunities
            </div>
            <figure className="plan__img--mask">
              <Image src="/assets/pricing-top.png" alt="pricing" width={340} height={200} />
            </figure>
          </div>
        </div>

        <div className="row">
          <div className="container">
            <div className="plan__features--wrapper">
              {FEATURES.map((feature) => (
                <div className="plan__features" key={feature.title}>
                  <figure className="plan__features--icon">{feature.icon}</figure>
                  <div className="plan__features--text">
                    <b>{feature.title}</b> {feature.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="section__title">Choose the plan that fits you</div>

            {PLANS.map((option, index) => (
              <div key={option.id}>
                <button
                  type="button"
                  className={`plan__card${selected === option.id ? " plan__card--active" : ""}`}
                  aria-pressed={selected === option.id}
                  onClick={() => setSelected(option.id)}
                >
                  <div className="plan__card--circle">
                    {selected === option.id && <div className="plan__card--dot" />}
                  </div>
                  <div className="plan__card--content">
                    <div className="plan__card--title">{option.title}</div>
                    <div className="plan__card--price">{option.price}</div>
                    <div className="plan__card--text">{option.note}</div>
                  </div>
                </button>
                {index === 0 && (
                  <div className="plan__card--separator">
                    <div className="plan__separator--line" />
                    <div className="plan__separator--text">or</div>
                    <div className="plan__separator--line" />
                  </div>
                )}
              </div>
            ))}

            <div className="plan__cta--wrapper">
              <button type="button" className="btn plan__cta--btn" onClick={onSubscribe}>
                {plan.cta}
              </button>
              <div className="plan__disclaimer">{plan.smallPrint}</div>
              {notice && (
                <div role="status" className="plan__notice">
                  {notice}
                </div>
              )}
            </div>

            <Accordion items={FAQS} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
