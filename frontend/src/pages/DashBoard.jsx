import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pullSubscription, pushSubscription } from "../redux/slice/authSlice";
import NotificationList from "../components/NotificationList";
import io from "socket.io-client";
import { addNotification } from "../redux/slice/notificationSlice";

const subscriptionsMethods = { follow: "follow", unFollow: "unfollow" };

const BACKEND_BASE_URL =
      import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

const socket = io(BACKEND_BASE_URL, { withCredentials: true });

const DashBoard = () => {
      const dispatch = useDispatch();
      const { subscriptions = [] } = useSelector((state) => state.auth);
      console.log({ subscriptions });

      const [teams, setTeams] = useState([]);

      const handleNotification = (notification) => {
            console.log("notification ", notification);
            dispatch(addNotification(notification));
      };
      useEffect(() => {
            socket.on("notification", handleNotification);

            axios.get(`/teams`).then(({ data }) => setTeams(data));

            return () => {
                  socket.off("notification", handleNotification);
            };
      }, []);

      const followreq = async (subscriptionsMethod, teamId) => {
            if (subscriptionsMethod === subscriptionsMethods.follow) {
                  axios.put(`/teams/${teamId}/subscription`).then(({ data }) =>
                        dispatch(pushSubscription(teamId))
                  );
            } else {
                  axios.put(`/teams/${teamId}/unSubscription`).then(
                        ({ data }) => dispatch(pullSubscription(teamId))
                  );
            }
      };

      return (
            <div>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                          <th scope="col" className="px-6 py-3">
                                                Team Name
                                          </th>
                                          <th scope="col" className="px-6 py-3">
                                                couch
                                          </th>
                                          <th scope="col" className="px-6 py-3">
                                                Members
                                          </th>
                                          <th scope="col" className="px-6 py-3">
                                                Follow
                                          </th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {teams.map(
                                          ({ name, coach, players, _id }) => (
                                                <tr
                                                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                      key={_id}
                                                >
                                                      <th
                                                            scope="row"
                                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                      >
                                                            {name}
                                                      </th>
                                                      <td className="px-6 py-4">
                                                            {coach}
                                                      </td>
                                                      <td className="px-6 py-4">
                                                            {players.map(
                                                                  (
                                                                        player,
                                                                        index
                                                                  ) => (
                                                                        <span
                                                                              key={
                                                                                    index
                                                                              }
                                                                        >
                                                                              {
                                                                                    player
                                                                              }
                                                                        </span>
                                                                  )
                                                            )}
                                                      </td>

                                                      <td className="px-6 py-4 ">
                                                            {subscriptions.includes(
                                                                  _id
                                                            ) ? (
                                                                  <button
                                                                        onClick={() =>
                                                                              followreq(
                                                                                    subscriptionsMethods.unFollow,
                                                                                    _id
                                                                              )
                                                                        }
                                                                  >
                                                                        unFollow
                                                                  </button>
                                                            ) : (
                                                                  <button
                                                                        onClick={() =>
                                                                              followreq(
                                                                                    subscriptionsMethods.follow,
                                                                                    _id
                                                                              )
                                                                        }
                                                                  >
                                                                        follow
                                                                  </button>
                                                            )}
                                                      </td>
                                                </tr>
                                          )
                                    )}
                              </tbody>
                        </table>
                  </div>
                  <NotificationList />
            </div>
      );
};

export default DashBoard;
