import { createSlice } from "@reduxjs/toolkit";
import { GUEST_EMAIL } from "@/lib/guest";

// Mirrors the Firebase auth user into the store so any component can read it
// without prop drilling.
//
// `status` is deliberately four-valued: "loading" (still asking Firebase) and
// "signedOut" (definitely nobody) look identical if you only store `user`, and
// a guest is signed IN, so it must not be treated the same as signed out.
//
// The documented guest is a real email/password account, so it is recognised by
// its address rather than by Firebase's isAnonymous flag.
const initialState = {
  user: null, // { uid, email, displayName, isAnonymous }
  status: "loading", // "loading" | "signedOut" | "guest" | "authenticated"
  // null until Stripe exists. The Firebase Stripe extension writes active
  // subscriptions to users/{uid}/subscriptions, and /choose-plan will start
  // populating this; until then every account reads as basic, which is the
  // correct behaviour anyway — nobody has paid.
  subscription: null, // null | "premium" | "premium-plus"
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      const isGuest =
        action.payload.isAnonymous || action.payload.email === GUEST_EMAIL;
      state.status = isGuest ? "guest" : "authenticated";
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "signedOut";
      state.subscription = null;
    },
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthError, setSubscription } = userSlice.actions;

// Selectors keep the state shape in one place — components ask a question
// instead of reaching into `state.user.status` and re-deriving the rule.
export const selectUser = (state) => state.user.user;
export const selectIsSignedIn = (state) =>
  state.user.status === "guest" || state.user.status === "authenticated";
export const selectAuthLoading = (state) => state.user.status === "loading";
export const selectSubscription = (state) => state.user.subscription;
export const selectIsSubscribed = (state) => state.user.subscription !== null;
export const selectIsGuest = (state) => state.user.status === "guest";

export default userSlice.reducer;
