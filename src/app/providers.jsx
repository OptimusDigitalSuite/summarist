"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { store } from "@/redux/store";
import { getFirebaseAuth } from "@/lib/firebase";
import { setUser, clearUser, setSubscription } from "@/redux/userSlice";

// Single subscription to Firebase, mirrored into Redux. Lives inside <Provider>
// so it can dispatch; unsubscribes on unmount so hot reload does not stack
// listeners.
function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Runs on the client only, so it is safe to touch Firebase here.
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(clearUser());
        return;
      }
      // Firebase user objects are not serialisable — pick the fields we use.
      dispatch(
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isAnonymous: firebaseUser.isAnonymous,
        })
      );

      // Ask the server what this user has paid for. Failing quietly is right:
      // a Stripe outage should leave someone on the basic plan, not break the
      // app for them.
      fetch(`/api/subscription?uid=${firebaseUser.uid}`)
        .then((r) => r.json())
        .then((data) => dispatch(setSubscription(data.plan ?? null)))
        .catch(() => {});
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}
