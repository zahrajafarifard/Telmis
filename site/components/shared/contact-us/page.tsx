"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import style from "./style.module.css";
import "@/components/shared/styles.css";

const ContactUs = () => {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<{ mobile: string; name: string; message: string }>({
    mode: "all",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target.getAttribute("data-target");
          if (entry.isIntersecting) {
            if (target === "left") {
              setIsLeftVisible(true);
              observer.unobserve(entry.target);
            } else if (target === "right") {
              setIsRightVisible(true);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => {
      if (leftRef.current) observer.unobserve(leftRef.current);
      if (rightRef.current) observer.unobserve(rightRef.current);
    };
  }, []);

  const submitCommentHandler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contact-us/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: getValues("name"),
          mobile: getValues("mobile"),
          message: getValues("message"),
        }),
      }
    );

    switch (response.status) {
      case 201:
        setValue("name", "");
        setValue("mobile", "");
        setValue("message", "");

        break;

      default:
        break;
    }
  };

  return (
    <div
      id="contactUs"
      className="flex flex-row w-[70%] mx-auto my-32 overflow-hidden
      screen1360:w-[80%]
      screen790:w-[90%] 
      screen690:flex-col-reverse "
    >
      <div
        ref={leftRef}
        data-target="left"
        className={`w-2/3 my-auto 
          screen1000:w-[55%] screen690:w-full screen690:mx-auto
          ${style.slideFromLeft} ${isLeftVisible ? style.visible : ""}`}
      >
        <div className="w-full mx-auto flex flex-row-reverse justify-between mb-8 screen1000:flex-col ">
          <input
            style={{
              WebkitBoxShadow: "0 0 0px 1000px #F8F8F8 inset",
            }}
            placeholder="نام شرکت خود را وارد کنید*"
            dir="rtl"
            className={`w-[49%] bg-[#F8F8F8] rounded-[4px] text-[#333] py-4 px-5 focus:outline-none screen1000:w-full screen1000:mb-2 screen690:mb-6
              ${errors.name && "border border-[#B3323A]"}
              `}
            {...register("name", {
              required: true,
            })}
          />
          <input
            style={{
              WebkitBoxShadow: "0 0 0px 1000px #F8F8F8 inset",
            }}
            placeholder="شماره تماس خود را وارد کنید*"
            dir="rtl"
            className={`w-[49%] bg-[#F8F8F8] rounded-[4px] text-[#333] py-4 px-5 focus:outline-none screen1000:w-full
              ${errors.mobile && "border border-[#B3323A]"}
              `}
            {...register("mobile", {
              required: "شماره تماس اجباری است",
              pattern: {
                value: /^[0-9]{11}$/,
                message: "شماره تماس معتبر نیست",
              },
            })}
          />
        </div>
        <div>
          <textarea
            style={{
              WebkitBoxShadow: "0 0 0px 1000px #F8F8F8 inset",
            }}
            placeholder="متن پیام خود را وارد کنید*"
            dir="rtl"
            className={`w-full bg-[#F8F8F8] rounded-[4px] text-[#333] py-4 px-5 focus:outline-none
              ${errors.message && "border border-[#B3323A]"}
              `}
            rows={10}
            {...register("message", {
              required: true,
            })}
          />
        </div>
        <div className=""></div>

        <button
          disabled={!isValid || !isDirty}
          onClick={submitCommentHandler}
          className="flex red-button-container cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="red-button-hover-effect"></span>
          <div className="red-button-text">ارسال پیام</div>
        </button>
      </div>
      <div
        ref={rightRef}
        data-target="right"
        className={`w-1/3 flex flex-col items-end 
          screen1000:w-[45%]
          screen690:w-full
          screen690:mx-auto
          screen690:mb-10
          ${style.slideFromRight} ${isRightVisible ? style.visible : ""}`}
      >
        <h3 className="text-[#333] text-[32px] font-[600] pb-4 screen690:text-[28px] ">
          با ما تماس بگیرید
        </h3>
        <h4
          style={{ direction: "rtl" }}
          className="text-[#C4161C] font-[500] pb-4 w-2/3
          screen1560:w-[84%] screen690:w-full "
        >
          در صورتی که سوالی دارید یا برای دریافت مشاوره رایگان فرم زیر را پر
          کنید.
        </h4>
        <h6
          style={{ direction: "rtl" }}
          className="text-[#333] text-[20px] pb-1"
        >
          آدرس:
        </h6>
        <p
          style={{ direction: "rtl" }}
          className="text-[#808080] pb-4 w-2/3
          screen1560:w-[84%] screen690:w-full"
        >
          میرداماد ، خیابان شمس تبریزی شمالی ، کوچه نیک‌‍ رای، پلاک‌3 ، طبقه اول
          ، واحد‌2
        </p>
        <h6
          style={{ direction: "rtl" }}
          className="text-[#333] text-[20px] pb-1"
        >
          شماره های تماس:
        </h6>
        <p className="text-[#808080] pb-4">021 - 91303343</p>
        <h6
          style={{ direction: "rtl" }}
          className="text-[#333] text-[20px] pb-1"
        >
          ایمیل:
        </h6>
        <p className="text-[#808080] pb-4">info@telmis.ir</p>
      </div>
    </div>
  );
};

export default ContactUs;
