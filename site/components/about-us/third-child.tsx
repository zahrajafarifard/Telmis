"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

import style from "./style.module.css";

const ThirdChild = () => {
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
      ref={containerRef}
      className={`${
        isVisible ? style.slideUpAnimation : ""
      } w-[70%] mx-auto flex flex-row-reverse my-36 border-l-8 border-[#A60014] rounded-[6px]
        screen1360:w-[80%]
        screen950:w-[86%]
        screen890:flex-col-reverse
        screen890:border-0
        screen690:w-[90%]
        screen690:my-20 `}
    >
      <div className="w-1/2 my-auto screen890:w-full screen890:mx-auto flex  justify-end">
        <Image
          src="/images/about (2).png"
          width={500}
          height={500}
          alt="ارزش های شرکت داده پردازان تلمیس"
          className="screen890:w-full  screen890:mx-auto screen890:my-14  rounded-[20px]"
        />
      </div>
      <div
        className="w-1/2 my-auto pr-10 pl-6 screen1560:pr-7 screen1460:px-6 screen890:w-full screen890:mx-auto
          screen890:border-l-8 border-[#A60014] rounded-[6px]  screen890:pr-2"
      >
        <h3 className="text-[#221D23] text-2xl font-bold text-right mb-2 screen890:mb-5">
          ارزش ها و اصول
        </h3>
        <p
          style={{ direction: "rtl" }}
          className="text-[#7C7C7C] text-lg leading-[190%] text-justify  
            screen1440:tracking-tight
            screen1440:leading-[170%]
            screen1200:text-[17px]
            screen1150:text-base
            screen890:tracking-normal
            screen890:leading-[190%]
            screen400:leading-[160%]
            screen400:-tracking-[0.2px]"
        >
          ما در شرکت خود به ارزش‌هایی همچون صداقت، مسئولیت‌پذیری، کیفیت برتر و
          نوآوری پایبندیم. این ارزش‌ها در تمامی فعالیت‌ها و تصمیم‌گیری‌های ما
          نمود پیدا می‌کنند و اساس فرهنگ سازمانی ما را تشکیل می‌دهند. صداقت در
          رفتار و گفتار، مسئولیت‌پذیری در قبال مشتریان و پروژه‌ها، تاکید بر
          کیفیت در تمامی خدمات و محصولات، و نوآوری در ارائه راه‌حل‌های جدید و
          بهبود مستمر، از جمله اصولی هستند که همواره به آن‌ها پایبندیم. ما
          معتقدیم که با رعایت این اصول می‌توانیم اعتماد مشتریان را جلب کرده و
          همکاری‌های پایدار و موفقی را رقم بزنیم. به‌ویژه در حوزه صرافی‌ها، با
          ارائه محصولات و خدمات منحصر به فرد، تلاش می‌کنیم نیازهای خاص این صنعت
          را به بهترین شکل ممکن پاسخ دهیم و در ارتقاء سطح خدمات مالی و تبادلات
          ارزی نقش مؤثری ایفا کنیم.
        </p>
      </div>
    </div>
  );
};

export default ThirdChild;
