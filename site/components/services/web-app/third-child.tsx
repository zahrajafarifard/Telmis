"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import image from "@/public/images/web-2.png";
import icon from "@/public/images/web (5).svg";

import style from "./style.module.css";

const ThirdChild = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target); // Stop observing after first view
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  return (
    <div
      ref={containerRef}
      className="flex flex-row w-[70%] justify-center items-center place-items-center mx-auto mt-2
      screen1460:w-[80%]
      screen1360:w-[80%]
      screen890:w-[90%]
      screen1100:flex-col "
    >
      <div
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
        } w-1/2 mx-auto my-auto screen1100:w-full `}
      >
        <Image
          src={image}
          alt="عکس"
          width={500}
          height={400}
          className="screen1100:mx-auto screen1100:w-[70%] screen1560:pr-6 my-auto"
        />
      </div>
      <div
        className="my-auto flex flex-col items-end 
        w-1/2 mx-auto mr-12
        screen1250:mr-10
        screen1100:w-full
        screen1100:items-center
        screen1100:mr-0 "
      >
        <h2
          className={` ${
            isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
          } text-[32px] text-[#333] font-bold  tracking-[-0.64px] leading-[59px] mb-4
          screen1100:mb-4
          screen950:text-[24px]
          screen1100:text-[32px]
          screen1100:w-full
          screen1100:text-center
          screen1100:mt-10
          screen1100:leading-[59px]
          screen1100:-tracking-[0.64px]
          screen450:text-[27px]
          screen350:text-[25px] `}
        >
          چرا ما را انتخاب کنید؟
        </h2>
        <h4
          style={{ direction: "rtl" }}
          className={`${
            isVisible ? `${style.slideUpAnimation} ${style.delay1}` : ""
          } text-[20px] text-[#919191] font-[500]  -tracking-[0.4px] leading-[37px] mb-11
          screen1650:leading-[30px]
          screen1650:-tracking-[0.5px]
          screen1100:text-[18px]
          screen1100:leading-[32px]
          screen950:leading-[26px]
          screen950:text-[17px] `}
        >
          تیم ما با داشتن سال‌ها تجربه در زمینه‌های مختلف طراحی و توسعه، همواره
          در تلاش است تا بهترین و به‌روزترین راه‌حل‌ها را برای نیازهای متنوع
          مشتریان فراهم آورد. خلاقیت در طراحی، بهره‌گیری از جدیدترین فناوری‌ها و
          رعایت اصول تجربه کاربری از جمله ویژگی‌هایی است که ما را از دیگران
          متمایز می‌کند. با انتخاب تلمیس، شما نه تنها یک سرویس‌دهنده بلکه یک
          شریک استراتژیک برای پیشبرد اهداف کسب‌وکارتان خواهید داشت. ما متعهد به
          ارائه خدماتی هستیم که به شما کمک می‌کند تا در بازار پررقابت امروز به
          موفقیت‌های بیشتری دست یابید.
        </h4>
        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-2 gap-4 
            screen1460:text-sm
            screen1200:text-[13px]
            screen1250:gap-y-2
            screen1100:text-base
            screen1100:center
            screen630:grid-cols-1 
            screen630:gap-y-5
            screen630:w-full
            screen630:mx-auto "
        >
          <div
            className={`${
              isVisible ? `${style.slideUpAnimation} ${style.delay2}` : ""
            } bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-60 
              screen1200:w-56
              screen1100:w-80
              screen790:w-64
              screen630:w-full
              screen630:mx-auto
              screen630:justify-center `}
          >
            <Image
              src={icon}
              width={25}
              height={25}
              alt="ایکن 1"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto">
              تجربه کاربری کاربرپسند و ساده
            </span>
          </div>
          <div
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${
                    width > 630 ? style.delay2 : style.delay3
                  }`
                : ""
            } 
              bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-60
              screen1200:w-56
              screen1100:w-80
              screen790:w-64
              screen630:w-full
              screen630:mx-auto
              screen630:justify-center 
              screen1250:mr-2
              screen690:mr-0 `}
          >
            <Image
              src={icon}
              width={25}
              height={25}
              alt="ایکن 2"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto">
              کدنویسی بهینه و استاندارد
            </span>
          </div>
          <div
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${
                    width > 630 ? style.delay3 : style.delay4
                  }`
                : ""
            } bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-60 
              screen1200:w-56
              screen1100:w-80
              screen790:w-64
              screen630:w-full
              screen630:mx-auto
              screen630:justify-center  `}
          >
            <Image
              src={icon}
              width={25}
              height={25}
              alt="ایکن 3"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto">امنیت و سرعت بالا</span>
          </div>
          <div
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${
                    width > 630 ? style.delay3 : style.delay5
                  }`
                : ""
            } bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-60
            screen1200:w-56
            screen1100:w-80
            screen790:w-64
            screen630:w-full
            screen630:mx-auto
            screen630:justify-center 
            screen1250:mr-2
            screen690:mr-0`}
          >
            <Image
              src={icon}
              width={25}
              height={25}
              alt="ایکن 4"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto">
              طراحی واکنش‌گرا و چندپلتفرمی
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdChild;
