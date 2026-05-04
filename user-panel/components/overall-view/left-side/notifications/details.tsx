import React from "react";
import Image from "next/image";

import moment from "moment-jalaali";

import activeIcn from "@/public/images/Notification.unread.svg";
import deactiveIcn from "@/public/images/Notification.read.svg";

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

  return (
    <div
      onClick={() => {}}
      className={`flex flex-row justify-between text-sm w-full mx-auto   py-5 rounded-[4px]`}
    >
      {notification?.status === "unread" ? (
        <div className="bg-[#F0F0F0] rounded-[10px]   h-10 my-auto flex justify-center items-center ml-5 w-[13%]">
          <Image
            alt=""
            src={activeIcn}
            className="mx-auto my-auto flex justify-center items-center"
          />
        </div>
      ) : (
        <div className="bg-[#F0F0F0] rounded-[10px] w-10 h-10 my-auto flex justify-center items-center ml-5">
          <Image
            alt=""
            src={deactiveIcn}
            className="mx-auto my-auto flex justify-center items-center"
          />
        </div>
      )}

      <div className="w-[85%]">
        {notification?.title === "change status" && (
          <div className="my-auto ">{`کاربر ${notification?.Client?.name} وضعیت سفارش شما عوض شد .`}</div>
        )}

        {notification?.title === "order registration" && (
          <div className="my-auto ">سفارش شما با موفقیت ثبت شد. </div>
        )}

        {notification?.title === "last product" && (
          <div className="my-auto ">{` تنها یک عدد از محصول موجود در لیست علاقه مندی ها  باقیمانده است .`}</div>
        )}
        <div className="my-auto text-[#afafaf]">
          {moment(notification?.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default Details;
