"use client";
import React, { useEffect, useState, useRef } from "react";
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
    <div id="camera" ref={containerRef} className="mt-24">
      <div
        className={`w-[70%] flex flex-row    mx-auto 
          screen1360:w-[80%] screen890:w-[90%] screen690:flex-col
          ${isVisible ? `${style.slideUpAnimation} ${style.delay1}` : ""}`}
      >
        <div className="my-auto w-1/2 mx-auto screen690:w-full screen1540:pr-3 ">
          <h3 className="text-right text-[#333] text-[32px] font-bold leading-[59px] tracking-[-0.64px] mb-6">
            امنیت شما تخصص ما
          </h3>
          <p
            style={{ direction: "rtl" }}
            className="text-justify text-[#919191] text-[20px] leading-[37px] -tracking-[0.4px] 
              screen1540:leading-[32px]
              screen1270:text-[18px]
              screen1100:text-[18px]
              screen1100:leading-[32px]
              screen950:leading-[26px]
              screen950:text-[17px]
              screen690:-tracking-[0.32px]
              screen690:leading-[32px]
              screen690:text-base "
          >
            ما با بیش از 10 سال تجربه در نصب و راه‌اندازی سیستم‌های نظارتی و
            دوربین‌های مداربسته، به یکی از معتبرترین شرکت‌ها در این حوزه تبدیل
            شده‌ایم. تیم متخصص و آموزش‌دیده ما با دانش فنی بالا، تضمین می‌کند که
            شما بهترین خدمات ممکن را دریافت کنید. ما از تجهیزات با کیفیت از
            برندهای معتبر استفاده می‌کنیم و کیفیت و کارایی تمامی محصولات و خدمات
            خود را تضمین می‌نماییم.
            <br />
            شرکت تلمیس راهکارهای نظارتی پیشرفته‌ای ارائه می‌دهد که به شبکه متصل
            و به راحتی از راه دور قابل مدیریت هستند. سیستم‌های ما به طور مداوم
            با جدیدترین فناوری‌ها به‌روز می‌شوند تا شما همیشه از بهترین و
            پیشرفته‌ترین امکانات بهره‌مند شوید. با خدمات تلمیس، می‌توانید از
            تحلیل‌های هوشمند، تشخیص فوری حوادث، و دسترسی سریع به داده‌های نظارتی
            بهره‌مند شوید. تیم پشتیبانی ما همواره آماده است تا نیازهای نظارتی
            شما را برآورده کند و امنیت شما را تضمین کند. با تلمیس، امنیت شما در
            اولویت است.
          </p>
        </div>
        <div
          className=" w-1/2 flex  justify-end  my-auto 
            screen690:justify-center
            screen690:w-[60%]
            screen550:w-[70%]
            screen690:mx-auto
            screen690:mt-12"
        >
          <Image
            src="/images/camera.png"
            width={500}
            height={500}
            alt="عکس"
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default FirstChild;
