import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";

import activeIcn from "../../../assets/images/Check_ring-red.svg";
import deactiveIcn from "../../../assets/images/Check_ring-black.svg";

const FinancialDetails = ({ notification }) => {
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      markAsRead();
    };
  }, []);

  const markAsRead = () => {
    const socket = io(`${process.env.REACT_APP_URL}`, {
      transports: ["websocket", "polling"],
      // transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("markAsReadFinancialNotif");
    });
  };

  return (
    <div
      onClick={() => {
        navigate("/receipts", {
          state: {
            id: notification?.Exchange?.id,
            username: notification?.Exchange?.username,
          },
        });
      }}
      className={`flex flex-row justify-between text-sm w-full mx-auto  px-3 py-5 
        rounded-[4px] mb-7
        
        ${
          notification?.status === "unread"
            ? "bg-[#FAF5F5] text-[#221D23]"
            : " bg-[#F7F7F7] text-[#6D6F72]"
        }
        `}
    >
      <div className="flex flex-row my-auto">
        {notification?.status === "unread" ? (
          <img src={activeIcn} className="ml-10" />
        ) : (
          <img src={deactiveIcn} className="ml-10" />
        )}
        <div className="my-auto">{`کاربر ${notification?.Exchange?.username} با شماره موبایل ${notification?.Exchange?.mobile} رسید مالی دانلود کرد`}</div>
      </div>
      <div className="my-auto text-[#afafaf]">
        {moment(notification?.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default FinancialDetails;
