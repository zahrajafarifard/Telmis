"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ServiceDetails from "./service-details";
import style from "./style.module.css";
import styles from "./Slideshow.module.css";

type Slide = { img: string; title: string; text: string; delay: string };

const Services = () => {
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(Array(6).fill(false));
  const [slideIndex, setSlideIndex] = useState(1);
  const currentSlide = (n: number) => setSlideIndex(n);
  const [width, setWidth] = useState<number>(0);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards: Slide[] = [
    {
      img: "/images/servic (6).svg",
      title: "خدمات شبکه ای",
      text: "به کسب‌وکارها و سازمان‌ها کمک می‌کند تا بهره‌وری و امنیت خود را افزایش دهند، ارتباطات را بهبود بخشند و از پشتیبانی مداوم برخوردار شوند.",
      delay: style.delay1,
    },
    {
      img: "/images/servic (3).svg",
      title: "طراحی و توسعه وبسایت",
      text: "طراحی و توسعه وبسایت شامل طراحی رابط و تجربه کاربری، توسعه وبسایت‌های واکنشگرا مناسب پلتفرم های مختلف...",
      delay: `${width > 1050 ? style.delay2 : style.delay1}`,
    },
    {
      img: "/images/servic (1).svg",
      title: "طراحی و توسعه اپلیکیشن",
      text: "توسعه وب اپلیکیشن شامل طراحی رابط و تجربه کاربری، طراحی و توسعه واکنشگرا، یکپارچه سازی با سیستم‌های دیگر و پشتیبانی...",
      delay: `${width > 1050 ? style.delay3 : style.delay2}`,
    },
    {
      img: "/images/servic (2).svg",
      title: "خدمات اختصاصی صرافی ها",
      text: "تیم ما بهترین خدمات اختصاصی را به صرافی‌ها ارائه می‌دهد. با اعتماد به ما، از خدمات بی‌نظیر ما بهره‌مند شوید. همیشه در کنار شما هستیم.",
      delay: `${width > 1050 ? style.delay1 : style.delay2}`,
    },
    {
      img: "/images/servic (4).svg",
      title: "محصولات صرافی",
      text: "با راهکارهای ما، تجربه‌ای مدرن و کارآمد را به مشتریان خود ارائه دهید و با اطمینان در بازار رقابتی امروز پیشتاز باشید.",
      delay: `${width > 1050 ? style.delay2 : style.delay3}`,
    },
    {
      img: "/images/servic (5).svg",
      title: "دوربین های مداربسته",
      text: "ما با ارائه بهترین دوربین‌های مداربسته، نصب و پشتیبانی حرفه‌ای، و راهکارهای نظارتی پیشرفته متصل به شبکه، امنیت شما را تضمین می‌کنیم.",
      delay: `${width > 1050 ? style.delay3 : style.delay3}`,
    },
  ];

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    serviceRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex < cards.length ? prevIndex + 1 : 1
    );
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex > 1 ? prevIndex - 1 : cards.length
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
  return (
    <div
      className="w-[70%] mx-auto flex flex-col justify-center items-center my-44
      screen1360:w-[80%] 
      screen1200:w-[83%] 
      screen1150:w-[86%] 
      screen1050:w-[80%] 
      screen890:w-[85%]
      screen750:w-[90%]
      screen630:w-[70%]
      screen550:w-[90%]
      screen630:my-20
    "
    >
      <h3
        ref={(el) => {
          serviceRefs.current[0] = el;
        }}
        className={` text-[#333] text-[32px] font-[600] screen630:hidden screen690:text-[24px]
          ${style.slideUpAnimation} ${isVisible[0] ? style.delayText : ""}`}
      >
        خدماتی که ارائه میدهیم
      </h3>
      <Link href="/about-us" prefetch={true} className="screen630:hidden">
        <h6
          ref={(el) => {
            serviceRefs.current[0] = el;
          }}
          className={`${style.slideUpAnimation} ${
            isVisible[0] ? style.delayText : ""
          } 
          mb-20 text-[#C4161C] text-base underline hover:text-[#A60014] cursor-pointer screen690:text-base `}
        >
          برای مطالعه بیشتر کلیک کنید
        </h6>
      </Link>
      <div
        style={{ direction: "rtl" }}
        className="grid grid-cols-3 gap-10 screen1560:gap-6
          screen1050:grid-cols-2
          screen1050:gap-8
          screen890:gap-7
          screen750:gap-6
          screen630:hidden "
      >
        {cards?.map((service, index) => (
          <div
            key={index}
            ref={(el) => {
              serviceRefs.current[index] = el;
            }}
            data-index={index}
            className={`${style.slideUpAnimation} ${
              isVisible[index] ? service.delay : ""
            }`}
          >
            <ServiceDetails
              img={service.img}
              title={service.title}
              text={service.text}
              index={index}
            />
          </div>
        ))}
      </div>

      <h3 className=" text-[#333] text-2xl font-[600] hidden screen630:grid">
        خدماتی که ارائه میدهیم
      </h3>
      <Link href="/about-us" prefetch={true}>
        <h6 className="mb-20 text-[#C4161C] text-base underline hover:text-[#A60014] cursor-pointer hidden screen630:grid">
          برای مطالعه بیشتر کلیک کنید
        </h6>
      </Link>

      <div
        ref={slideshowRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        className={`${styles.slider} ${styles.slideshowContainer} hidden screen630:grid`}
      >
        {cards.map((slide, index) => (
          <div
            key={index}
            className={` ${styles.slides} ${styles.mySlides} ${
              slideIndex === index + 1 ? styles.fade : ""
            }`}
            style={{ display: slideIndex === index + 1 ? "block" : "none" }}
          >
            <ServiceDetails
              img={slide.img}
              title={slide.title}
              text={slide.text}
              index={index}
            />
          </div>
        ))}

        <div style={{ textAlign: "center" }} className=" mt-4">
          {cards.map((_, index) => (
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

export default Services;
