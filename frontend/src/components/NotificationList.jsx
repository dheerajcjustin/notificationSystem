import React, { useEffect } from "react";
import { loadAllNotifications } from "../redux/slice/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

const NotificationList = () => {
      const { notifications, loading, error } = useSelector(
            (state) => state.notification
      );
      const dispatch = useDispatch();

      useEffect(() => {
            // Dispatch the loadAllNotifications action when the component mounts
            dispatch(loadAllNotifications());
      }, [dispatch]);

      return (
            <div className="w-96  text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white max-h-96 overflow-y-auto  mx-auto  ">
                  <h1 className=" text-3xl bg-primary-600  text-white hover:bg-primary-700">
                        Notifications
                  </h1>
                  {notifications.map(({ _id, message }) => (
                        <span
                              key={_id}
                              href="#"
                              aria-current="true"
                              className="block w-full px-4 py-2 text-primary-600  border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600"
                        >
                              {message}
                        </span>
                  ))}
            </div>
      );
};

export default NotificationList;
