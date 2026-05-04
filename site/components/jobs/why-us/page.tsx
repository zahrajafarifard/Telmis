"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WhyDetails from "./why-details";
import style from "./style.module.css";

const WhyUs = () => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(Array(7).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setIsVisible((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
            observer.unobserve(entry.target); // Stop observing after element becomes visible
          }
        });
      },
      { threshold: 0.2 }
    );

    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-[80%] mx-auto flex flex-col justify-center items-center mb-44
    screen1440:w-[85%]
    screen1360:w-[95%]

    
    
    "
    >
      <h3
        ref={(el) => {
          elementsRef.current[0] = el;
        }}
        data-index={0}
        className={`text-[#333] text-[32px] font-[600]
          screen690:text-2xl
          ${style.slideUpAnimation} ${isVisible[0] ? style.delay1 : ""}`}
      >
        مزایای همکاری با ما
      </h3>
      <Link href="/about-us" prefetch={true}>
        <h6
          ref={(el) => {
            elementsRef.current[1] = el;
          }}
          data-index={1}
          className={`mb-20 text-[#C4161C] text-base underline hover:text-[#A60014] cursor-pointer ${
            style.slideUpAnimation
          } ${isVisible[1] ? style.delay1 : ""}`}
        >
          موقعیت ها شغلی عالی
        </h6>
      </Link>

      <div
        className="grid grid-cols-3 justify-center items-center
      screen690:grid-cols-1
      "
      >
        <div>
          {[
            {
              img: "/images/img (6).svg",
              title: "تعادل بین کار و زندگی",
              text: "ما به اهمیت زندگی شخصی کارکنان احترام می‌گذاریم و انعطاف‌پذیری در ساعات کاری، امکان دورکاری، و مرخصی‌های با حقوق را فراهم می‌کنیم.",
              dir: "left",
              delay: style.delay1,
            },
            {
              img: "/images/img (5).svg",
              title: "فرهنگ نوآورانه و پیشرو",
              text: "شما در شرکتی کار خواهید کرد که همیشه به دنبال راه‌حل‌های خلاقانه و نوآورانه است. ما از ایده‌های جدید استقبال می‌کنیم و از کارکنان خود حمایت می‌کنیم تا به دنبال بهبود مستمر باشند.",
              dir: "left",
              delay: style.delay2,
            },
            {
              img: "/images/img (4).svg",
              title: "قدردانی از تلاش‌ها و موفقیت‌ها",
              text: "ما به موفقیت‌های فردی و تیمی اهمیت می‌دهیم و از کارکنان خود با برنامه‌های تشویقی، جوایز، و تقدیرنامه‌ها قدردانی می‌کنیم. موفقیت شما، موفقیت ماست.",
              dir: "left",
              delay: style.delay3,
            },
          ].map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                elementsRef.current[index + 2] = el;
              }}
              data-index={index + 2}
              className={`${style.slideUpAnimation} ${
                isVisible[index + 2] ? item.delay : ""
              }`}
            >
              <WhyDetails
                img={item.img}
                title={item.title}
                text={item.text}
                dir={item.dir}
              />
            </div>
          ))}
        </div>
        <div
          ref={(el) => {
            elementsRef.current[5] = el;
          }}
          data-index={5}
          className={`${style.slideUpAnimation} ${
            isVisible[5] ? style.delay1 : ""
          }`}
        >
          <Image
            src="/images/why-us.svg"
            width={400}
            height={400}
            alt="why us"
            className="mx-auto "
          />
        </div>
        <div>
          {[
            {
              img: "/images/img (3).svg",
              title: "فرصت‌های رشد و پیشرفت حرفه‌ای",
              text: "ما به توسعه مهارت‌های فردی و حرفه‌ای کارکنان اهمیت می‌دهیم و برنامه‌های آموزشی، دوره‌های توسعه مهارت، و فرصت‌های ارتقای شغلی را برای شما فراهم می‌کنیم.",
              dir: "right",
              delay: style.delay1,
            },
            {
              img: "/images/img (2).svg",
              title: "محیط کاری پویا و الهام‌بخش",
              text: "فرهنگ کاری ما بر پایه احترام، همکاری و نوآوری است. شما در محیطی دوستانه و حمایت‌کننده کار خواهید کرد که ایده‌هایتان مورد استقبال قرار می‌گیرد.",
              dir: "right",
              delay: style.delay2,
            },
            {
              img: "/images/img (1).svg",
              title: "حقوق و مزایای رقابتی",
              text: "ما به کارکنان خود پاداش‌های جذابی ارائه می‌دهیم، از جمله حقوق پایه رقابتی، پاداش‌های عملکرد، بیمه‌های تکمیلی و مزایای رفاهی.",
              dir: "right",
              delay: style.delay3,
            },
          ].map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                elementsRef.current[index + 6] = el;
              }}
              data-index={index + 6}
              className={`${style.slideUpAnimation} ${
                isVisible[index + 6] ? item.delay : ""
              }`}
            >
              <WhyDetails
                img={item.img}
                title={item.title}
                text={item.text}
                dir={item.dir}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
