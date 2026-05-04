"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

import img from "@/public/images/net-2.png";
import icon1 from "@/public/images/net-serv (1).svg";
import icon2 from "@/public/images/net-serv (2).svg";
import icon3 from "@/public/images/net-serv (3).svg";
import icon4 from "@/public/images/net-serv (4).svg";
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
      className="flex flex-row w-[70%] justify-center items-center place-items-center mx-auto mt-20
      screen1360:w-[80%]
      screen890:w-[90%]
      screen1100:flex-col"
    >
      <div
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
        }  w-1/2  flex flex-col items-start
        
        screen1100:w-full 
        screen1100:mb-12
        screen1100:items-center
        `}
      >
        <Image
          src={img}
          alt="خدمات شبکه شرکت داده پردازان تلمیس"
          width={400}
          height={400}
          className="screen1100:mx-auto screen1100:w-[70%] rounded-[20px]"
        />
      </div>
      <div
        className="w-1/2 mx-auto my-auto flex flex-col items-end 
        screen1100:w-full
        screen1100:items-center
      "
      >
        <h2
          className={` ${
            isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
          } text-[32px] text-[#333] font-bold  -tracking-[0.64px] leading-[59px] mb-4
            screen1250:text-[30px]
            screen1100:text-right 
            screen1100:w-full
            screen690:text-[27px]
            screen690:-tracking-[0.54px]
            screen690:leading-[49px]
            screen450:text-[24px]
            screen400:text-[22px]
            screen350:text-[21px]


          `}
        >
          چه کسانی به خدمات شبکه نیاز دارند ؟
        </h2>
        <h4
          style={{ direction: "rtl" }}
          className={`${
            isVisible ? `${style.slideUpAnimation} ${style.delay1}` : ""
          }  text-[20px] text-[#919191] font-[500]  tracking-[-0.4px] leading-[37px] mb-11
          screen1250:text-[19px]
          screen1250:leading-[35px]
          screen1250:mb-8
          screen450:text-[18px]
        
          `}
        >
          خدمات شبکه برای طیف گسترده‌ای از افراد و سازمان‌ها ضروری است. این
          خدمات نه تنها کسب‌وکارها، بلکه افراد و گروه‌های مختلف دیگری را نیز
          شامل می‌شود.
        </h4>
        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-2 gap-4 
          screen1460:text-sm
          screen1200:text-[13px]
          screen1250:gap-y-2
          screen1100:text-base
          screen630:grid-cols-1 
          screen630:gap-y-5
          screen630:w-full
          screen630:mx-auto "
        >
          <div
            className={`${
              isVisible ? `${style.slideUpAnimation} ${style.delay2}` : ""
            }  bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-64 
            screen1200:w-56
            screen1100:w-80
            screen790:w-64
            screen630:w-full
            screen630:mx-auto
            screen630:justify-center 
            `}
          >
            <Image
              src={icon1}
              width={25}
              height={25}
              alt="ایکن خدمات شبکه تلمیس 1"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto">شرکت های فناوری اطلاعات</span>
          </div>
          <div
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${
                    width > 630 ? style.delay2 : style.delay3
                  }`
                : ""
            } bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-64 
              screen1200:w-56 
              screen1540:mr-3
              screen1200:mr-0
              screen1100:w-80
              screen790:w-64
              screen630:w-full
              screen630:mx-auto
              screen630:justify-center `}
          >
            <Image
              src={icon4}
              width={25}
              height={25}
              alt="ایکن خدمات شبکه تلمیس 4"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto"> مراکز مالی و بانکی</span>
          </div>
          <div
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${
                    width > 630 ? style.delay3 : style.delay4
                  }`
                : ""
            } bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-64 
              screen1200:w-56 
              screen1200:pr-3
              screen1100:w-80
              screen790:w-64
              screen630:w-full
              screen630:mx-auto
              screen630:justify-center `}
          >
            <Image
              src={icon2}
              width={25}
              height={25}
              alt="ایکن خدمات شبکه تلمیس 2"
              className="ml-2 my-auto"
            />
            <span className="text-white my-auto">
              مراکز دولتی و سازمان های عمومی
            </span>
          </div>
          <div
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${
                    width > 630 ? style.delay3 : style.delay5
                  }`
                : ""
            } bg-[#A60014] flex flex-row rounded-[50px] py-2 pr-4 w-64 
              screen1200:w-56 screen1540:mr-3
              screen1200:mr-0
              screen1100:w-80
              screen790:w-64
              screen630:w-full
              screen630:mx-auto 
              screen630:justify-center `}
          >
            <Image
              src={icon3}
              width={25}
              height={25}
              alt="ایکن خدمات شبکه تلمیس 3"
              className="ml-2 my-auto "
            />
            <span className="text-white my-auto">
              کسب و کار های کوچک و بزرگ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdChild;
