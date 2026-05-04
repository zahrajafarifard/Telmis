"use client";
import React, { useState } from "react";
import Image from "next/image";
import moment from "moment-jalaali";
import userIcon from "@/public/images/shop/user.svg";

import StarRating from "./rating";

// interface CommentType {
//   id: number;
//   name: string;
//   createdAt: string;
//   text: string;
// }

interface Comment {
  name: string;
  mail: string;
  text: string;
}

type ProductCommentType = {
  id: number;
  name: string;
  mail: string;
  text: string;
  createdAt: string;
};
interface PropsType {
  productId: number;
  comments: ProductCommentType[];
}
const Comments: React.FC<PropsType> = ({ productId, comments }) => {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  const [rating, setRating] = useState<number>(0); // Store the current rating

  const [comment, setComment] = useState<Comment>({
    name: "",
    mail: "",
    text: "",
  });

  const submitComment = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: comment?.name,
          mail: comment?.mail,
          text: comment?.text,
          rating,
        }),
      }
    );

    switch (response.status) {
      case 201:
        setComment({ name: "", mail: "", text: "" });
        setRating(0);

        break;

      default:
        break;
    }
  };
  return (
    <div>
      <div
        id="contactUs"
        className="flex flex-row w-[100%] mx-auto mt-14
        
        screen790:w-[90%] 
        screen690:flex-col-reverse "
      >
        <div
          className={`w-2/3 my-auto 
          screen1000:w-[55%]
          screen690:w-full
          screen690:mx-auto   `}
        >
          <div className="w-full mx-auto flex flex-row-reverse justify-between mb-8 screen1000:flex-col    ">
            <input
              value={comment?.name}
              onChange={(e) => {
                setComment((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              placeholder="نام خود را وارد کنید*"
              dir="rtl"
              className="w-[49%] bg-[#F8F8F8] rounded-[4px] text-[#333] py-4 px-5 focus:outline-none screen1000:w-full screen1000:mb-2  screen690:mb-6
            "
            />
            <input
              value={comment?.mail}
              onChange={(e) => {
                setComment((prev) => ({
                  ...prev,
                  mail: e.target.value,
                }));
              }}
              placeholder="ایمیل خود را وارد کنید*"
              dir="rtl"
              className="w-[49%] bg-[#F8F8F8] rounded-[4px] text-[#333] py-4 px-5 focus:outline-none screen1000:w-full"
            />
          </div>
          <div>
            <textarea
              value={comment?.text}
              onChange={(e) => {
                setComment((prev) => ({
                  ...prev,
                  text: e.target.value,
                }));
              }}
              placeholder="متن پیام خود را وارد کنید*"
              dir="rtl"
              className="w-full  bg-[#F8F8F8] rounded-[4px] text-[#333] py-4 px-5  whitespace-pre-line focus:outline-none  "
              rows={6}
            />
          </div>

          <div className="flex flex-row-reverse justify-between mt-8 screen1000:flex-col-reverse screen1000:mt-5">
            <div
              onClick={submitComment}
              className="relative overflow-hidden group cursor-pointer rounded-full bg-[#A60014] place-self-end screen1000:mt-5 screen1000:place-self-end"
            >
              <span
                className={`absolute z-10 bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 
              rounded-full group-hover:opacity-100 group-hover:scale-150 
              bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E] `}
              ></span>
              <div
                className="relative z-20 text-white text-lg w-fit px-14 py-3 rounded-[50px] text-center mx-auto
                screen690:text-base items-center "
              >
                ارسال پیام
              </div>
            </div>
            <div className="flex flex-row-reverse space-x-3 space-x-reverse my-auto ">
              <span
                style={{ direction: "rtl" }}
                className="text-[#221D23] text-lg screen1000:text-base"
              >
                امتیاز دهید!
              </span>
              <StarRating rating={rating} setRating={setRating} />
            </div>
          </div>
        </div>
        <div
          className={`w-1/3 flex flex-col items-end 
          screen1000:w-[45%]
          screen690:w-full
          screen690:mx-auto
          screen690:mb-10 `}
        >
          <h3
            className="text-[#333] text-[32px] font-[600] pb-4 text-right
            screen690:text-[28px]  "
          >
            دیدگاه خود را بنویسید
          </h3>
          <h4
            style={{ direction: "rtl" }}
            className="text-[#C4161C] font-[500] pb-4 w-2/3 leading-[27px]
            screen1560:w-[84%]
            screen690:w-full
          "
          >
            نشانی ایمیل شما منتشر نخواهد شد. بخش‌های موردنیاز علامت‌گذاری
            شده‌اند *
          </h4>
        </div>
      </div>

      {comments?.length > 0 && (
        <hr className="my-14 bg-[#DFDFDF] w-full h-[2px]" />
      )}
      {comments?.map((item, index) => {
        return (
          <div key={item?.id}>
            <div className="flex flex-row-reverse my-auto ">
              <div className="bg-[#D9D9D9] w-10 h-10 flex justify-center  rounded-full my-auto screen750:w-9 screen750:h-9">
                <Image
                  src={userIcon}
                  width={33}
                  height={33}
                  alt="کاربر"
                  className="screen750:w-6 screen750:h-6 my-auto"
                />
              </div>

              <p className="text-[#221D23] text-2xl leading-[36px] my-auto mx-3 screen1250:text-lg screen750:text-base screen400:text-sm ">
                {item?.name}
              </p>
              <p className="text-[#221D23] text-2xl leading-[36px] my-auto ml-3 screen1250:text-lg screen750:text-base screen400:text-sm">
                -
              </p>
              <p
                style={{ direction: "rtl" }}
                className="text-[#221D23] text-2xl leading-[36px] my-auto screen1250:text-lg screen750:text-base screen400:text-sm"
              >
                {moment(item?.createdAt).format("dddd jDD jMMMM jYYYY")}
              </p>
            </div>

            <p
              style={{ direction: "rtl" }}
              className="text-[#919191] text-xl leading-[38px] text-justify my-5 whitespace-pre-wrap break-words screen1250:text-lg screen750:text-base"
            >
              {item?.text.split("\r\n")}
            </p>
            {comments?.length - 1 !== index && (
              <hr className="my-14 bg-[#DFDFDF] w-full h-[2px]" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
