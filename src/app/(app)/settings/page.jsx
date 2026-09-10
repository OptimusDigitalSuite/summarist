"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { openLogin } from "@/redux/modalSlice";
import {
  selectUser,
  selectIsSignedIn,
  selectAuthLoading,
  selectSubscription,
} from "@/redux/userSlice";

// Plan names come straight from the documentation: basic (with an upgrade
// button to the sales page), premium, or premium-plus.
const PLAN_LABELS = {
  null: "Basic",
  premium: "Premium",
  "premium-plus": "Premium-Plus",
};

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const signedIn = useSelector(selectIsSignedIn);
  const authLoading = useSelector(selectAuthLoading);
  const subscription = useSelector(selectSubscription);

  if (authLoading) return <SettingsSkeleton />;

  if (!signedIn) {
    return (
      <div className="settings">
        <div className="settings__title">Settings</div>
        <div className="settings__login--wrapper">
          <Image src="/assets/login.png" alt="Log in" width={360} height={280} />
          <div className="settings__login--text">
            Log in to your account to see your details.
          </div>
          <button type="button" className="btn settings__login--btn" onClick={() => dispatch(openLogin())}>
            Login
          </button>
        </div>
      </div>
    );
  }

  const plan = PLAN_LABELS[subscription] ?? "Basic";

  return (
    <div className="settings">
      <div className="settings__title">Settings</div>

      <div className="settings__content">
        <div className="settings__sub--title">Your Subscription plan</div>
        <div className="settings__text">{plan}</div>
        {subscription === null && (
          <Link className="btn settings__upgrade--btn" href="/choose-plan">
            Upgrade to Premium
          </Link>
        )}
      </div>

      <div className="settings__content">
        <div className="settings__sub--title">Email</div>
        <div className="settings__text">{user?.email}</div>
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="settings">
      <div className="settings__title">Settings</div>
      <div className="settings__content">
        <div className="skeleton" style={{ width: 180, height: 16 }} />
        <div className="skeleton" style={{ width: 80, height: 14, marginTop: 12 }} />
      </div>
      <div className="settings__content">
        <div className="skeleton" style={{ width: 60, height: 16 }} />
        <div className="skeleton" style={{ width: 220, height: 14, marginTop: 12 }} />
      </div>
    </div>
  );
}
