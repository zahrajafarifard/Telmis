import React, { useEffect } from "react";
import Image from "next/image";

import moment from "moment-jalaali";
import { io } from "socket.io-client";

import activeIcn from "@/public/images/Check_ring-red.svg";
import deactiveIcn from "@/public/images/Check_ring-gray.svg";

interface NotificationType {
  id: number;
  status: "read" | "unread";
  message: string;
  title: string;
  createdAt: string;
  Client: { name: string };
}

interface PropType {
  notification: NotificationType;
}
const Details: React.FC<PropType> = ({ notification }) => {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  useEffect(() => {
    return () => {
      markAsRead();
    };
  }, []);

  const markAsRead = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("markAsReadClientShopNotif");
    });
  };

  return (
    <div
      onClick={() => {}}
      className={`flex flex-row justify-between text-sm w-full mx-auto  px-6 py-5 rounded-[4px] mb-7        
        ${
          notification?.status === "unread"
            ? "bg-[#FAF5F5] text-[#221D23]"
            : " bg-[#F7F7F7] text-[#6D6F72]"
        }
        `}
    >
      <div className="flex flex-row my-auto">
        {notification?.status === "unread" ? (
          <Image alt="" src={activeIcn} className="ml-8" />
        ) : (
          <Image alt="" src={deactiveIcn} className="ml-8" />
        )}

        {notification?.title === "change status" && (
          <div className="my-auto">{`کاربر ${notification?.Client?.name} وضعیت سفارش شما عوض شد .     `}</div>
        )}

        {notification?.title === "order registration" && (
          <div className="my-auto">{`کاربر ${notification?.Client?.name} سفارش شما ثبت شد . `}</div>
        )}

        {notification?.title === "last product" && (
          <div className="my-auto">{`کاربر ${notification?.Client?.name} تنها یک عدد از محصول موجود در علاقه مندی های شما باقیمانده است .   `}</div>
        )}
      </div>
      <div className="my-auto text-[#afafaf]">
        {moment(notification?.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default Details;
