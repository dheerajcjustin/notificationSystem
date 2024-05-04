import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      user: localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null,
      subscriptions: [],
};

const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
            setCredentials: (state, action) => {
                  console.log("paylaod", action.payload);
                  state.user = action.payload;
                  localStorage.setItem("user", JSON.stringify(action.payload));
                  state.subscriptions = action.payload?.subscriptions || [];
            },
            pushSubscription: (state, action) => {
                  state.subscriptions.push(action.payload);
            },
            pullSubscription: (state, action) => {
                  state.subscriptions = state.subscriptions.filter(
                        (sub) => sub !== action.payload
                  );
            },

            logout: (state, action) => {
                  state.user = null;
                  localStorage.removeItem("user");
                  state.subscription = [];
            },
      },
});

export const { setCredentials, logout, pullSubscription, pushSubscription } =
      authSlice.actions;

export default authSlice.reducer;
