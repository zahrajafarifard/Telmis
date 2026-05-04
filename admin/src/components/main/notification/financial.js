import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import errIcn from "../../../assets/images/error2.svg";
import FinancialDetails from "./financial-details";
import Pagination from "../../shared-component/pagination";

const Financial = () => {
  const [notifications, setNotifications] = useState([]);
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _notifs = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/financial-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ page: currentPage, pageSize: itemsPerPage }),
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();

          setNotifications(_data?.data?.rows);
          settTotalItems(_data?.data?.count);

          break;

        default:
          break;
      }
    };

    token && _notifs();
  }, [setNotifications, token, currentPage, totalItems]);

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_URL}`, {
      transports: ["websocket", "polling"],
      // transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.on("downloadReceipt", (notif) => {
        setNotifications((prev) => {
          const newNotifications = Array.isArray(notif?.data)
            ? notif.data
            : [notif?.data];
          const uniqueNotifications = newNotifications.filter(
            (newNotif) =>
              !prev.some((existingNotif) => existingNotif.id === newNotif.id)
          );
          return [...prev, ...uniqueNotifications];
        });
      });
    });
  }, [token]);

  return (
    <>
      {notifications?.length !== 0 ? (
        <>
          {notifications.some(
            (notification) => notification?.status === "unread"
          ) && (
            <div className="bg-[#B71F26] bg-opacity-[20%] w-fit my-10  text-[#1E1B1B] text-sm px-4 py-0.5 rounded-[4px] ">
              جدید ها
            </div>
          )}
          {notifications?.map(
            (notification) =>
              notification?.status === "unread" && (
                <FinancialDetails
                  key={notification?.id}
                  notification={notification}
                />
              )
          )}
          {notifications.some(
            (notification) => notification?.status === "read"
          ) && (
            <div className="text-[#1E1B1B] text-sm bg-[#1E1B1B]  bg-opacity-20  w-fit my-10  px-4 py-0.5 rounded-[4px] ">
              مشاهده شده
            </div>
          )}
          {notifications?.map(
            (notification) =>
              notification?.status === "read" && (
                <FinancialDetails
                  key={notification?.id}
                  notification={notification}
                />
              )
          )}
        </>
      ) : (
        <div className="text-[#6D6F72] text-2xl my-auto mx-auto h-full flex flex-col items-center justify-center mt-44">
          <img src={errIcn} className="mb-3 w-20 h-20 " />
          <span>در حال حاضر اعلانی برای نمایش وجود ندارد.</span>
        </div>
      )}

      <div className="">
        {notifications?.length !== 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Financial;
