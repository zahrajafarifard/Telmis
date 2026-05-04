"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
      id="net"
      style={{ direction: "rtl" }}
      className="flex flex-row w-[70%] justify-center items-center place-items-center mx-auto mt-20 
      screen1360:w-[80%]
      screen890:w-[90%]
      screen690:flex-col-reverse
      "
    >
      <div
        ref={containerRef}
        className={`${
          isVisible ? `${style.slideUpAnimation} ` : ""
        } w-1/2 screen690:w-full screen690:mt-12`}
      >
        <Image
          src="/images/net-1.png"
          width={550}
          height={400}
          alt="خدمات شبکه"
        />
      </div>
      <div
        className={`${
          isVisible ? `${style.slideUpAnimation}` : ""
        } w-1/2 mx-auto mr-12  screen1250:mr-10  screen690:w-full screen690:mr-0 `}
      >
        <h3
          className="text-[#333] text-right font-bold text-[32px] mb-6
          screen1100:text-[28px] 
          screen1100:mb-4
          screen950:text-[24px]
          screen690:text-[32px]
          screen690:leading-[59px]
          screen690:-tracking-[0.64px]
          screen450:text-[27px]
          screen350:text-[25px]  "
        >
          چرا به خدمات شبکه نیاز داریم ؟
        </h3>
        <h4
          className="text-[#919191] text-[20px] text-justify tracking-[-0.4px] leading-[37px] w-full 
          screen1100:text-[18px]
          screen1100:leading-[32px]
          screen950:leading-[26px]
          screen950:text-[17px] "
        >
          خدمات شبکه به کسب‌وکارها و سازمان‌ها کمک می‌کند تا بهره‌وری و امنیت
          خود را افزایش دهند، ارتباطات را بهبود بخشند و از پشتیبانی مداوم
          برخوردار شوند. از کسب‌وکارهای کوچک تا بزرگ، مراکز آموزشی، بهداشتی،
          دولتی، شرکت‌های فناوری اطلاعات و مراکز مالی، همگی به شبکه‌های قوی و
          پایدار نیاز دارند. این خدمات تضمین می‌کنند که شبکه‌ها همیشه در بهترین
          حالت عمل کرده و آماده مقیاس‌پذیری و توسعه باشند.
        </h4>
      </div>
    </div>
  );
};

export default FirstChild;
