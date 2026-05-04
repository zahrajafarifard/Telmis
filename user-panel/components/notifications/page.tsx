"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

import { io } from "socket.io-client";

import { RootState } from "@/store/store";
import Details from "./details";
import errIcn from "@/public/images/error-red.svg";
import Pagination from "@/components/shared/pagination/page";

interface NotificationType {
  id: number;
  status: "read" | "unread";
  message: string;
  title: string;
  createdAt: string;
  Client: { name: string };
}

interface SocketNotification {
  data: NotificationType | NotificationType[];
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const _token = useSelector((state: RootState) => state.client.token);
  const [token, setToken] = useState<string>("");

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };

  useEffect(() => {
    setToken(_token);
  }, [_token, token]);

  useEffect(() => {
    const _notifs = async () => {
      let _data;
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();

          setNotifications(_data?.data?.rows);
          setTotalItems(_data?.data?.count);

          break;

        default:
          break;
      }
    };
    // token && _notifs();

    if (token) {
      _notifs();
    }
  }, [token, currentPage, setCurrentPage, setTotalItems, itemsPerPage]);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket", "polling"],
      // transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.on("orderRegistration", (notif: SocketNotification) => {
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
      socket.on("changeStatus", (notif: SocketNotification) => {
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

      socket.on("latestProduct", (notif: SocketNotification) => {
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
  }, []);

  return (
    <>
      {notifications?.length !== 0 ? (
        <div style={{ direction: "rtl" }} className="w-[90%] mx-auto">
          {notifications.some(
            (notification: NotificationType) =>
              notification?.status === "unread"
          ) && (
            <div className="bg-[#B71F26] bg-opacity-[20%] w-fit my-10 px-4 py-0.5 rounded-[4px] text-[#1E1B1B] text-sm ">
              جدید ها
            </div>
          )}
          {notifications?.map((notification: NotificationType, index) => {
            return (
              notification?.status === "unread" && (
                <div key={index}>
                  <Details notification={notification} />
                </div>
              )
            );
          })}
          {notifications.some(
            (notification: NotificationType) => notification?.status === "read"
          ) && (
            <div className="text-[#1E1B1B] text-sm bg-[#1E1B1B]  bg-opacity-20  w-fit my-10  px-4 py-0.5 rounded-[4px] ">
              مشاهده شده
            </div>
          )}
          {notifications?.map((notification: NotificationType, index) => {
            return (
              notification?.status === "read" && (
                <div key={index}>
                  <Details notification={notification} />
                </div>
              )
            );
          })}
        </div>
      ) : (
        <div className="text-[#6D6F72] text-2xl my-auto mx-auto h-full flex flex-col items-center justify-center mt-44">
          <Image src={errIcn} alt="" className="mb-3 w-20 h-20 " />
          <span style={{ direction: "rtl" }}>اعلان جدیدی ندارید!</span>
        </div>
      )}

      <div style={{ direction: "rtl" }} className="my-20">
        {totalItems > 0 && (
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

export default Notification;
