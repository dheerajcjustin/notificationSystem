import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
      notifications: [],
      loading: false,
      error: null,
};

// Async thunk to load notifications
export const loadAllNotifications = createAsyncThunk(
      "notification/loadAll",
      async (_, { rejectWithValue }) => {
            try {
                  const response = await axios.get(
                        "http://localhost:5000/notifications"
                  );
                  return response.data;
            } catch (error) {
                  // If an error occurs, return the error object
                  return rejectWithValue(error.response.data);
            }
      }
);

const notificationSlice = createSlice({
      name: "notification",
      initialState,
      reducers: {
            // Reducer for adding a notification
            addNotification: (state, action) => {
                  // Add the new notification to the state
                  console.log(action.payload);

                  state.notifications.push(action.payload);
            },
            // Reducer for marking a notification
            markNotification: (state, action) => {
                  // Update the notification in the state, marking it as read or unread
                  // Example: Assuming the action.payload contains the ID of the notification
                  const notification = state.notifications.find(
                        (notif) => notif.id === action.payload
                  );
                  if (notification) {
                        notification.read = !notification.read;
                  }
            },
      },
      extraReducers: (builder) => {
            // Extra reducers for handling async actions
            builder
                  .addCase(loadAllNotifications.pending, (state) => {
                        // Set loading state to true while fetching notifications
                        state.loading = true;
                        state.error = null; // Reset error state
                  })
                  .addCase(loadAllNotifications.fulfilled, (state, action) => {
                        // Set loading state to false and update notifications when fetch is successful
                        state.loading = false;
                        state.notifications = action.payload;
                  })
                  .addCase(loadAllNotifications.rejected, (state, action) => {
                        // Set loading state to false and store error when fetch fails
                        state.loading = false;
                        state.error = action.payload; // Payload here will be the error object
                  });
      },
});

export const { addNotification, markNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
