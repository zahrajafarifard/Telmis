"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

import { io } from "socket.io-client";

import { RootState } from "@/store/store";
import Details from "./details";
import errIcn from "@/public/images/error-red.svg";

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
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token, token]);

  useEffect(() => {
    const _notifs = async () => {
      let _data;
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/notifications/latest`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();

          setNotifications(_data?.data);

          break;

        default:
          break;
      }
    };

    // token && _notifs();

    if (token) {
      _notifs();
    }
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

          const combinedNotifications = [...prev, ...uniqueNotifications];
          return combinedNotifications.slice(0, 6);
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
          const combinedNotifications = [...prev, ...uniqueNotifications];
          return combinedNotifications.slice(0, 6);
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
          const combinedNotifications = [...prev, ...uniqueNotifications];
          return combinedNotifications.slice(0, 6);
        });
      });
    });
  }, [token]);

  return (
    <div className="w-[90%] mx-auto mt-14">
      <div className="flex flex-row-reverse space-x-4 space-x-reverse justify-between  w-full ">
        <div className="text-[#333] text-lg my-auto ">آخرین اعلانات</div>

        <hr className="flex-grow my-auto border-[#D9D9D9]" />
        <Link href={"/client/notification"} className="my-auto">
          <div className="text-[#A60014] my-auto underline text-xs">
            مشاهده بیشتر
          </div>
        </Link>
      </div>

      {notifications?.length !== 0 ? (
        <div style={{ direction: "rtl" }} className="">
          {notifications?.map((notification: NotificationType, index) => {
            return (
              notification?.status === "unread" && (
                <div key={index}>
                  <Details notification={notification} />
                </div>
              )
            );
          })}

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
    </div>
  );
};

export default Notification;
