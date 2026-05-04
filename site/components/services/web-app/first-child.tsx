"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

import image from "@/public/images/web.png";
import style from "./style.module.css";

const FirstChild = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      id="web-app"
      style={{ direction: "rtl" }}
      ref={containerRef}
      className={`
      ${isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""}
        flex flex-row w-[70%] justify-center items-center place-items-center mx-auto my-28
        screen1360:w-[80%]
        screen890:w-[90%]
        screen690:flex-col-reverse
      `}
    >
      <div
        className=" w-1/2 mx-auto flex flex-col items-start
          screen690:w-full
          screen690:mt-12
          screen690:items-center "
      >
        <Image src={image} width={400} height={400} alt="عکس" />
      </div>
      <div className="w-1/2 mx-auto screen690:w-full screen1250:mr-10 screen690:mr-0 ">
        <h3
          className="text-[#333] text-right font-bold text-[32px] 
          screen1100:text-[28px] 
          screen1100:mb-4
          screen950:text-[24px]
          screen690:text-[32px]
          screen690:leading-[59px]
          screen690:-tracking-[0.64px]
          screen450:text-[27px]
          screen350:text-[25px] "
        >
          چرا تلمیس ؟
        </h3>
        <h4
          className="text-[#919191] text-[20px] text-justify tracking-[-0.4px] leading-[37px] w-full
          screen1100:text-[18px]
          screen1100:leading-[32px]
          screen950:leading-[26px]
          screen950:text-[17px]
        "
        >
          در دنیای امروز، طراحی و توسعه وبسایت و اپلیکیشن‌ها به یکی از اصلی‌ترین
          عوامل موفقیت و رشد کسب‌وکارها تبدیل شده است. یک وبسایت یا اپلیکیشن با
          طراحی حرفه‌ای و کاربرپسند می‌تواند نه تنها توجه مشتریان را جلب کند،
          بلکه اعتماد آنها را نیز به دست آورد و تبدیل به یک ابزار مؤثر برای جذب
          و نگهداشت مشتریان شود. در این مسیر، شرکت تلمیس با بهره‌گیری از ترکیبی
          از تخصص فنی، تجربه عملی و خلاقیت هنری، خدماتی بی‌نظیر و منحصر به فرد
          ارائه می‌دهد که شما را چندین گام جلوتر از رقبا قرار می‌دهد.
        </h4>
      </div>
    </div>
  );
};

export default FirstChild;
