import { createSlice } from "@reduxjs/toolkit";

// Which auth panel the modal is showing, and whether it is open at all.
// Kept in Redux rather than local state because the Nav, the Hero CTA and the
// library page all need to open it, and none of them are each other's parent.
const initialState = {
  isOpen: false,
  view: "login", // "login" | "signup"
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLogin: (state) => {
      state.isOpen = true;
      state.view = "login";
    },
    openSignup: (state) => {
      state.isOpen = true;
      state.view = "signup";
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    toggleView: (state) => {
      state.view = state.view === "login" ? "signup" : "login";
    },
  },
});

export const { openLogin, openSignup, closeModal, toggleView } = modalSlice.actions;
export default modalSlice.reducer;
