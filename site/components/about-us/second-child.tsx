"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

import style from "./style.module.css";

const SecondChild = () => {
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
      } w-[70%] mx-auto flex flex-row my-48 border-r-8 border-[#A60014] rounded-[6px]
        screen1360:w-[80%]
        screen950:w-[86%]
        screen890:flex-col-reverse
        screen890:border-0
        screen890:my-0
        screen690:w-[90%]
        screen690:my-20 `}
    >
      <div className="w-1/2 screen890:w-full screen890:mx-auto">
        <Image
          src="/images/about (1).png"
          width={500}
          height={500}
          alt="ماموریت شرکت داده پردازان تلمیس"
          className="screen890:w-full screen890:mx-auto screen890:my-14  rounded-[20px]"
        />
      </div>
      <div
        className="w-1/2  my-auto screen1540:pl-4 pr-6 screen1460:px-6 screen890:w-full screen890:mx-auto
          screen890:border-r-8 border-[#A60014] rounded-[6px] screen890:pl-2"
      >
        <h3 className="text-[#221D23] text-2xl font-bold text-right mb-2 screen890:mb-5">
          ماموریت و چشم انداز
        </h3>
        <p
          style={{ direction: "rtl" }}
          className="text-[#7C7C7C] text-lg leading-[190%] text-justify
            screen1440:tracking-tight
            screen1200:text-[17px]
            screen1150:text-base
            screen890:tracking-normal
            screen890:leading-[190%]
            screen400:leading-[160%]
            screen400:-tracking-[0.2px] "
        >
          ماموریت ما ارائه خدمات بی‌نظیر و تخصصی در زمینه شبکه و طراحی وبسایت
          برای تمامی صنایع، به‌ویژه صرافی‌ها است. هدف ما این است که با بهره‌گیری
          از تکنولوژی‌های پیشرفته و تیم حرفه‌ای خود، بهترین راه‌حل‌ها را برای
          مشتریان فراهم کنیم و با ارائه خدمات مطمئن و با کیفیت، رضایت آنان را
          جلب نماییم. چشم‌انداز ما تبدیل شدن به اولین انتخاب صرافی‌ها برای خدمات
          شبکه و طراحی وبسایت در سطح ملی و بین‌المللی است. در این راستا، ما به
          دنبال ارتقاء کیفیت و امنیت در تبادلات مالی هستیم و تلاش می‌کنیم با
          ارائه محصولات و خدمات اختصاصی به این حوزه، نقش مهمی در رشد و توسعه آن
          ایفا کنیم.
        </p>
      </div>
    </div>
  );
};

export default SecondChild;
