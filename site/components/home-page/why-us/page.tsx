"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import WhyDetails from "./why-details";
import style from "./style.module.css";

const WhyUs = () => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(Array(7).fill(false));
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
        screen950:w-[100%]
        screen690:w-[90%]
        screen690:mb-20"
    >
      <h3
        ref={(el) => {
          elementsRef.current[0] = el;
        }}
        data-index={0}
        className={`text-[#333] text-[32px] font-[600] screen690:text-2xl
          ${style.slideUpAnimation} ${isVisible[0] ? style.delay1 : ""}`}
      >
        چرا ما را انتخاب کنید؟
      </h3>
      <Link href="/about-us" prefetch={true}>
        <h6
          ref={(el) => {
            elementsRef.current[1] = el;
          }}
          data-index={1}
          className={`mb-20 text-[#C4161C] text-base underline hover:text-[#A60014] cursor-pointer screen630:mb-10 ${
            style.slideUpAnimation
          } ${isVisible[1] ? style.delay1 : ""}`}
        >
          برای مطالعه بیشتر کلیک کنید
        </h6>
      </Link>

      <div
        ref={(el) => {
          elementsRef.current[1] = el;
        }}
        data-index={1}
        className={` hidden screen950:flex screen690:hidden ${
          style.slideUpAnimation
        } ${isVisible[1] ? style.delay1 : ""}`}
      >
        <Image
          src="/images/why-us.svg"
          width={400}
          height={400}
          alt="عکس"
          className="mx-auto "
        />
      </div>

      <div className="grid grid-cols-3 justify-center items-center screen950:grid-cols-2 screen950:gap-4 screen690:grid-cols-1 ">
        <div className="">
          {[
            {
              img: "/images/img (6).svg",
              title: "تجربه کاربری کاربرپسند و ساده",
              text: "طراحی یک رابط کاربری ساده و کاربرپسند که بدون پیچیدگی، امکان استفاده سریع و آسان را برای همه کاربران فراهم کند.",
              dir: "left",
              delay: style.delay1,
            },
            {
              img: "/images/img (5).svg",
              title: "کدنویسی بهینه و استاندارد",
              text: "پیاده‌سازی کدهای بهینه و استاندارد، که علاوه بر کارایی بالا، نگهداری و توسعه‌ی آتی پروژه را نیز آسان‌تر می‌کند.",
              dir: "left",
              delay: style.delay2,
            },
            {
              img: "/images/img (4).svg",
              title: "امنیت و سرعت بالا",
              text: "ایجاد فضایی امن و پرسرعت با استفاده از تکنیک‌ها و پروتکل‌های روز که کاربران را در مقابل تهدیدات محافظت کند و عملکرد سریعی ارائه دهد.",
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
                index={index}
              />
            </div>
          ))}
        </div>
        <div
          ref={(el) => {
            elementsRef.current[5] = el;
          }}
          data-index={5}
          className={`screen950:hidden screen690:grid ${
            style.slideUpAnimation
          } ${isVisible[5] ? (width > 690 ? style.delay1 : style.delay3) : ""}`}
        >
          <Image
            src="/images/why-us.svg"
            width={400}
            height={400}
            alt="عکس"
            className="mx-auto "
          />
        </div>
        <div className="">
          {[
            {
              img: "/images/img (3).svg",
              title: "تیم حرفه‌ای و مجرب",
              text: "بهره‌گیری از تیمی حرفه‌ای با تخصص و تجربه کافی برای ارائه محصولی با کیفیت و رضایت‌بخش.",
              dir: "right",
              delay: style.delay1,
            },
            {
              img: "/images/img (2).svg",
              title: "طراحی واکنش‌گرا و چندپلتفرمی",
              text: "طراحی محصولی که در تمامی دستگاه‌ها و پلتفرم‌ها به صورت بی‌نقص و هماهنگ اجرا شود.",
              dir: "right",
              delay: style.delay2,
            },
            {
              img: "/images/img (1).svg",
              title: "رشد دادن کسب و کار های نوپا",
              text: "ارائه زیرساخت‌ها و ابزارهای مناسب برای کمک به استارتاپ‌ها در جهت تسریع رشد و رسیدن به اهدافشان.",
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
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
