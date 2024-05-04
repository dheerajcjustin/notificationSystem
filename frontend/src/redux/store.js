import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import notificationReducer from "./slice/notificationSlice";

const store = configureStore({
      reducer: {
            auth: authReducer,
            notification: notificationReducer,
      },

      devTools: true,
});

export default store;
