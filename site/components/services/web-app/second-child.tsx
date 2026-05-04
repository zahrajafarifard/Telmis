"use client";
import React, { useState, useEffect, useRef } from "react";

import ServiceDetails from "./second-child-details";
import style from "./style.module.css";
import styles from "./slideshow.module.css";

type Slide = { img: string; title: string; text: string };
const slids: Slide[] = [
  {
    img: "/images/web (1).svg",
    title: "طراحی و توسعه وبسایت",
    text: "طراحی و توسعه وبسایت شامل طراحی رابط و تجربه کاربری، توسعه وبسایت‌های  واکنشگرا مناسب پلتفرم های مختلف، ایجاد فروشگاه آنلاین و نگهداری و  پشتیبانی مستمر است تا وبسایت همیشه به‌روز و کارآمد باشد.",
  },

  {
    img: "/images/web (2).svg",
    title: "طراحی و توسعه اپلیکیشن",
    text: "طراحی و توسعه اپلیکیشن موبایل، شامل طراحی تجربه کاربری و توسعه  اپلیکیشن‌های اندروید و iOS، نگهداری و پشتیبانی مستمر و بهینه‌سازی عملکرد اپلیکیشن است تا تجربه کاربری بهینه‌ای ارائه شود.",
  },

  {
    img: "/images/web (4).svg",
    title: "طراحی و توسعه وب اپلیکیشن‌",
    text: "توسعه وب اپلیکیشن شامل طراحی رابط و تجربه کاربری، طراحی و توسعه واکنشگرا،  یکپارچه سازی با سیستم‌های دیگر و پشتیبانی وب اپلیکیشن‌ها است تا عملکرد  بهینه و کارآمدی برای کاربران فراهم شود.",
  },

  {
    img: "/images/web (3).svg",
    title: "بازطراحی وبسایت و اپلیکیشن",
    text: "بازطراحی وبسایت و اپلیکیشن شامل تحلیل وبسایت و اپلیکیشن فعلی، طراحی مجدد رابط  کاربری، بهینه‌سازی ساختار و عملکرد، و مهاجرت و پیاده‌سازی بازطراحی است  تا تجربه کاربری بهبود یافته و عملکرد کلی بهینه شود.",
  },
];
const SecondChild = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const dragStartX = useRef<number | null>(null);

  const currentSlide = (n: number) => setSlideIndex(n);
  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex < slids.length ? prevIndex + 1 : 1
    );
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex > 1 ? prevIndex - 1 : slids.length
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
      className="w-[75%] mx-auto flex flex-col justify-center items-center my-44
      screen1360:w-[84%]
      screen1250:w-2/3
      screen1100:w-[74%]
      screen1000:w-[80%]
      screen890:w-[88%]
      screen690:w-[80%]
      screen550:w-[90%] "
    >
      <h3
        className={` ${
          isVisible ? `${style.slideUpAnimation} ` : ""
        } text-[#333] text-[32px] font-[600] `}
      >
        خدماتی که ارائه میدهیم
      </h3>
      <h6
        className={`
          ${isVisible ? `${style.slideUpAnimation} ` : ""}
          mb-20 text-[#C4161C] text-base `}
      >
        طراحی وب سایت و اپلیکیشن
      </h6>
      <div
        style={{ direction: "rtl" }}
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay1}` : ""
        } grid grid-cols-4 gap-6
          screen1250:grid-cols-2
          screen1250:gap-8
          screen690:hidden `}
      >
        {slids?.map((item, index) => {
          return (
            <ServiceDetails
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
        className={` ${styles.slider} ${styles.slideshowContainer} hidden screen690:grid`}
      >
        {slids.map((slide, index) => (
          <div
            key={index}
            className={`${styles.mySlides} ${styles.slides} ${
              slideIndex === index + 1 ? styles.fade : ""
            }`}
            style={{ display: slideIndex === index + 1 ? "block" : "none" }}
          >
            <ServiceDetails
              img={slide.img}
              title={slide.title}
              text={slide.text}
            />
          </div>
        ))}

        <div style={{ textAlign: "center" }} className=" mt-4">
          {slids.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                slideIndex === index + 1 ? styles.active : ""
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
