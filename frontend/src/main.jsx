import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./index.css";

import {
      createBrowserRouter,
      createRoutesFromElements,
      Route,
      RouterProvider,
} from "react-router-dom";
import LoginScreen from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;
const BACKEND_BASE_URL =
      import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

axios.defaults.baseURL = BACKEND_BASE_URL;

const router = createBrowserRouter(
      createRoutesFromElements(
            <Route path="/" element={<App />}>
                  <Route index={true} path="/" element={<LoginScreen />} />
                  <Route path="/register" element={<SignupPage />} />

                  <Route path="" element={<PrivateRoute />}>
                        <Route path="/dashBoard" element={<DashBoard />} />
                  </Route>
            </Route>
      )
);
ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
            <Provider store={store}>
                  <RouterProvider router={router} />

                  <App />
            </Provider>
      </React.StrictMode>
);
