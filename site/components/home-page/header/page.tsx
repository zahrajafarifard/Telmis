import React from "react";

import style from "./header.module.css";
import Image from "next/image";
import Link from "next/link";

import { PeydaBlack } from "@/app/layout";

const HeaderHomePage = ({}) => {
  return (
    <div className={`${style.backgroundImage} `}>
      <div style={{ direction: "rtl" }} className="w-[80%] screen500:w-[98%] ">
        <h1
          className={` ${PeydaBlack.className}  ${style.slideUpAnimation} ${style.delay1} text-white text-[78px] font-extrabold text-right
          screen1460:text-[60px]
          screen1250:text-[50px]
          screen1000:text-[40px]
          screen890:mt-10
          screen790:text-[34px]
          screen690:text-[52px]
          screen690:mb-0
          screen690:mt-96
          screen690:leading-[62px]
          screen690:text-center
          screen630:text-[49px]
          screen550:text-[46px]
          screen450:text-[38px]
          screen350:text-[35px]
          whitespace-nowrap
          screen450:whitespace-normal
          `}
        >
          <span className="screen450:hidden">
            داده پــــردازان تــلــمــیــس
          </span>

          <span className="hidden screen450:grid">
            داده پـردازان تــلـمـیـس
          </span>
        </h1>
        <h2
          className={` ${style.slideUpAnimation} ${style.delay2} text-[#fff] text-[48px] font-[600] text-right
          screen1460:text-[38px]
          screen1250:text-[28px]
          screen690:text-[34px]
          screen690:mb-3
          screen690:text-center
          screen500:text-[32px]
          screen400:text-[30px]
          screen350:text-[28px]
          `}
        >
          از 0 تا 1 همراه شما
        </h2>
        <h4
          className={` ${style.slideUpAnimation} ${style.delay3} text-white w-1/2 text-[26px] tracking-[-0.26px] leading-[40px]
          screen1460:text-[19px]
          screen1250:text-[16px]
          screen790:text-[13px]
          screen790:leading-[28px]
          screen690:text-base
          screen690:mb-3
          screen690:leading-[32px]
          screen690:text-center
          screen690:w-full
          screen500:px-4 `}
        >
          شرکت ما با ارائه راه‌حل‌های جامع در زمینه شبکه، توسعه وب و امنیت، به
          کسب‌وکارها کمک می‌کند تا به بالاترین سطح عملکرد و ایمنی دست یابند. ما
          به کیفیت و پشتیبانی بی‌نظیر متعهدیم.
        </h4>

        <div
          className={` ${style.slideUpAnimation} ${style.delay4} flex flex-row w-1/6 justify-between my-10
            screen1250:mb-8
            screen1250:mt-6
            screen790:mb-6
            screen790:mt-4
            screen790:w-1/4
            screen690:w-[40%]
            screen690:mx-auto
            screen690:my-10
            screen400:w-1/2
            screen400:mb-8
            screen400:mt-6
            screen350:w-[52%]
        
          `}
        >
          <Link href="https://telmis.ir" className="group">
            <Image
              src="/images/whatsApp.svg"
              width={34}
              height={34}
              alt="واتس اپ"
              className="transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert
              screen790:w-[25px]
              screen790:h-[25px]
              screen690:w-[34px]
              screen690:h-[34px]
              "
            />
          </Link>

          <Link href="https://telmis.ir" className="group">
            <Image
              src="/images/insta.svg"
              width={34}
              height={34}
              alt="اینستا"
              className="transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert
                screen790:w-[25px]
                screen790:h-[25px]
                screen690:w-[34px]
                screen690:h-[34px]
              "
            />
          </Link>
          <Link href="https://telmis.ir" className="group">
            <Image
              src="/images/telegram.svg"
              width={34}
              height={34}
              alt="تلگرام"
              className="transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert
                screen790:w-[25px]
                screen790:h-[25px]
                screen690:w-[34px]
                screen690:h-[34px]
              "
            />
          </Link>
          <Link href="https://telmis.ir" className="group">
            <Image
              src="/images/linkedIn.svg"
              width={34}
              height={34}
              alt="لینکداین"
              className="transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert
                screen790:w-[25px]
                screen790:h-[25px]
                screen690:w-[34px]
                screen690:h-[34px]
              "
            />
          </Link>
        </div>

        <div
          className=" flex flex-row
            screen690:flex-col
            screen690:w-72 
            screen690:mx-auto
            screen500:w-40   "
        >
          <div
            className={` ${style.slideUpAnimation} ${style.delay5} bg-white rounded-[50px] py-3 px-4 relative overflow-hidden group
              screen1000:py-2
              screen790:py-1
              screen690:py-3
              screen690:mb-3
              screen690:px-0
              screen500:py-1.5            
            `}
          >
            <span className="absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 bg-[#FFDA8A] rounded-full group-hover:opacity-100 group-hover:scale-150"></span>
            <Link href="#contactUs">
              <h3
                className={`${style.textColor}   text-lg text-center relative z-10
                screen1250:text-base
                screen1000:text-[15px]
                screen690:text-lg
                screen500:text-base             
              `}
              >
                با ما در تماس باشید
              </h3>
            </Link>
          </div>

          <div
            className={` ${style.slideUpAnimation} ${style.delay6} bg-white rounded-[50px] py-3 px-4 mr-4 relative overflow-hidden group
            screen1000:py-2
            screen790:py-1
            screen690:py-3
            screen690:px-0
            screen690:mb-14
            screen690:mr-0
            screen500:py-1.5
            `}
          >
            <span className="absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 bg-[#FFDA8A] rounded-full group-hover:opacity-100 group-hover:scale-150"></span>

            <Link href="#certificates">
              <h3
                className={`${style.textColor} rounded-[50px] text-lg text-center relative z-10 
                  screen1250:text-base
                  screen1000:text-[15px]
                  screen690:text-lg
                  screen500:text-base
              
              `}
              >
                شروع کنید
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderHomePage;
