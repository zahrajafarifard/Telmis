"use client";
import React, { useRef, useEffect, useState } from "react";
import SecondChildDetails from "./second-child-details";

import style from "./style.module.css";

type Slide = { img: string; title: string; text: string };
const slides: Slide[] = [
  {
    img: "/images/cam (1).svg",
    title: "نصب دوربین‌های آنالوگ و دیجیتال",
    text: `کابل‌کشی‌های تخصصی و مخفی
    ...
    راه‌اندازی سیستم نظارت از راه دور
    ...
    تست و عیب‌یابی اولیه پس از نصب`,
  },
  {
    img: "/images/cam (2).svg",
    title: "مشاوره تخصصی انتخاب دوربین‌",
    text: `فروش تجهیزات از برندهای معتبر
    ...
    ارائه پکیج‌های کامل نصب و راه‌اندازی
    ...
    تضمین بهترین قیمت و کیفیت`,
  },
  {
    img: "/images/cam (3).svg",
    title: "پشتیبانی ۲۴/۷ برای رفع مشکلات",
    text: `بازدیدهای دوره‌ای برای بررسی عملکرد
    ...
    انجام بروزرسانی‌های نرم‌افزاری منظم
    ...
    خدمات گارانتی و پس از فروش مطمئن `,
  },
  {
    img: "/images/cam (4).svg",
    title: "بهینه‌سازی عملکرد سیستم‌ها",
    text: `بروزرسانی فریم‌ور تجهیزات
    ...
    افزودن دوربین‌های جدید به شبکه
    ...
    نصب سیستم‌های مدیریت تصاویر`,
  },
];
const SecondChild = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const currentSlide = (n: number) => setSlideIndex(n);
  const dragStartX = useRef<number | null>(null);

  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex < slides.length ? prevIndex + 1 : 1
    );
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex > 1 ? prevIndex - 1 : slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = (e as React.TouchEvent).touches
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
    dragStartX.current = clientX;
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = (e as React.TouchEvent).changedTouches
      ? (e as React.TouchEvent).changedTouches[0].clientX
      : (e as React.MouseEvent).clientX;

    if (dragStartX.current === null) return;

    const dragDistance = dragStartX.current - clientX;

    if (dragDistance > 50) {
      // Dragged left
      nextSlide();
    } else if (dragDistance < -50) {
      // Dragged right
      prevSlide();
    }

    dragStartX.current = null; // Reset drag start position
  };

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
      className="w-[75%] mx-auto my-52 screen1360:w-[84%] screen790:w-[90%]"
    >
      <h2
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
        } text-[#221D23] text-[32px] font-[600]  text-center  mb-2 `}
      >
        خدماتی که ارائه میدهیم
      </h2>
      <h4
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
        } text-[#A60014] mb-20 text-center`}
      >
        دوربین های مداربسته
      </h4>

      <div
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay1}` : ""
        } w-full mx-auto grid grid-cols-4 gap-6 screen690:hidden
        screen1460:gap-4
        screen1100:grid-cols-2
        screen1100:gap-7
        screen1100:w-[80%]
        screen1050:w-[90%]
        screen890:w-[100%]
        screen890:gap-5 `}
      >
        {slides?.map((item, index) => {
          return (
            <SecondChildDetails
              key={index}
              img={item.img}
              title={item.title}
              text={item.text}
            />
          );
        })}
      </div>

      <div
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        className={`${style.slideshowContainer} ${style.slider} hidden screen690:grid w-[80%] screen630:w-[86%] screen550:w-[100%] `}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${style.mySlides} ${style.slides} ${
              slideIndex === index + 1 ? style.fade : ""
            }`}
            style={{ display: slideIndex === index + 1 ? "block" : "none" }}
          >
            <SecondChildDetails
              img={slide.img}
              title={slide.title}
              text={slide.text}
            />
          </div>
        ))}

        <div style={{ textAlign: "center" }} className=" mt-4">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${style.dot} ${
                slideIndex === index + 1 ? style.active : ""
              }`}
              onClick={() => currentSlide(index + 1)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondChild;
