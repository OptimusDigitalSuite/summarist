"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { GUEST_EMAIL, GUEST_PASSWORD } from "@/lib/guest";
import { closeModal, toggleView } from "@/redux/modalSlice";

// The three errors the documentation asks for, plus the codes the current
// Firebase SDK actually returns (it collapses wrong-password and no-such-user
// into invalid-credential, so both map to the same message).
const ERRORS = {
  "auth/invalid-email": "Invalid email.",
  "auth/weak-password": "Password is too short. Use at least 6 characters.",
  "auth/user-not-found": "User not found.",
  "auth/wrong-password": "User not found.",
  "auth/invalid-credential": "User not found.",
  "auth/email-already-in-use": "There is already an account with that email.",
  "auth/popup-closed-by-user": "The Google window closed before sign-in finished.",
  "auth/operation-not-allowed":
    "That sign-in method is not enabled in the Firebase console yet.",
};

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, view } = useSelector((state) => state.modal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const isSignup = view === "signup";

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(closeModal());
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const run = async (fn, { redirect = true } = {}) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await fn();
      if (redirect) {
        setEmail("");
        setPassword("");
        dispatch(closeModal());
        router.push("/for-you");
      }
    } catch (err) {
      setError(ERRORS[err?.code] || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  // Guest login, the way the documentation describes it: a real dummy account,
  // logged in with hardcoded credentials. Not anonymous auth — the settings
  // page has to display an email, and a guest needs one.
  const onGuest = () =>
    run(() => signInWithEmailAndPassword(getFirebaseAuth(), GUEST_EMAIL, GUEST_PASSWORD));

  const onGoogle = () =>
    run(() => signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()));

  const onSubmit = (e) => {
    e.preventDefault();
    run(() =>
      isSignup
        ? createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
        : signInWithEmailAndPassword(getFirebaseAuth(), email, password)
    );
  };

  const onForgotPassword = () => {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    run(
      async () => {
        await sendPasswordResetEmail(getFirebaseAuth(), email);
        setNotice("Password reset email sent.");
      },
      { redirect: false }
    );
  };

  return (
    <div className="auth" onClick={() => dispatch(closeModal())}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isSignup ? "Sign up" : "Log in"}
        className="auth__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth__title">{isSignup ? "Sign up to Summarist" : "Log in to Summarist"}</div>

        <div className="auth__main">
          {!isSignup && (
            <>
              <button type="button" className="btn guest__btn--wrapper" onClick={onGuest} disabled={busy}>
                <figure className="google__icon--mask">
                  <FaUser />
                </figure>
                <div>Login as a Guest</div>
              </button>
              <div className="auth__separator">
                <span className="auth__separator--text">or</span>
              </div>
            </>
          )}

          <button type="button" className="btn google__btn--wrapper" onClick={onGoogle} disabled={busy}>
            <figure className="google__icon--mask">
              <FcGoogle />
            </figure>
            <div>{isSignup ? "Sign up with Google" : "Login with Google"}</div>
          </button>

          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>

          <form className="auth__main--form" onSubmit={onSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="auth__main--input"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="auth__main--input"
            />

            {error && (
              <div role="alert" className="auth__error">
                {error}
              </div>
            )}
            {notice && <div className="auth__notice">{notice}</div>}

            <button type="submit" className="btn" disabled={busy}>
              {busy ? "One moment…" : isSignup ? "Sign up" : "Login"}
            </button>
          </form>
        </div>

        {!isSignup && (
          <button type="button" className="auth__forgot--password" onClick={onForgotPassword}>
            Forgot your password?
          </button>
        )}

        <button type="button" className="auth__switch--btn" onClick={() => dispatch(toggleView())}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
        </button>

        <button
          type="button"
          aria-label="Close"
          className="auth__close--btn"
          onClick={() => dispatch(closeModal())}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
