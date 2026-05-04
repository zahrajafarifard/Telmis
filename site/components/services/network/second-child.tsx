"use client";
import React, { useRef, useState, useEffect } from "react";

import ServiceDetails from "./second-child-details";
import style from "./style.module.css";
import styles from "./slideshow.module.css";

type Service = {
  img: string;
  title: string;
  text: string;
  delay: string;
};

const SecondChild = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [slideIndex, setSlideIndex] = useState(1);

  const dragStartX = useRef<number | null>(null);

  // Group services into pairs
  const chunkArray = (array: Service[], size: number): Service[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const services: Service[] = [
    {
      img: "/images/icon (1).svg",
      title: "راه اندازی و نصب شبکه",
      text: `راه اندازی شبکه ای کامپیوتری
      ...
      نصب و پیکربندی تجهیزات شبکه
      ...
      تست و ارزیابی اولیه شبکه`,
      delay: "delay1",
    },
    {
      img: "/images/icon (8).svg",
      title: "پشتیبانی و نگهداری شبکه",
      text: `پشتیبانی شبکه
      ...
      اعزام کارشناس حضوری شبکه
      ...
      بروزرسانی دوره ای تجهیزات`,
      delay: `${
        windowWidth != undefined && windowWidth <= 1050 ? "delay1" : "delay2"
      }`,
    },
    {
      img: "/images/icon (7).svg",
      title: "خدمات اکتیو شبکه",
      text: `نصب و پیکربندی سوئیچ ها و روترها
      ...
      تنظیمات و پیکربندی سرورها
      ...
      بهینه سازی عملکرد تجهیزات شبکه`,

      delay: `${
        windowWidth != undefined && windowWidth <= 1050 ? "delay2" : "delay3"
      }`,
    },
    {
      img: "/images/icon (6).svg",
      title: "خدمات پسیو شبکه",
      text: `کابل کشی و نصب فیزیکی تجهیزات
      ...
      برق کشی و تجهیزات لازم برای شبکه
      ...
      آرایش رک و تجهیزات مرتبط`,

      delay: `${
        windowWidth != undefined && windowWidth <= 1050 ? "delay2" : "delay4"
      }`,
    },
    {
      img: "/images/icon (5).svg",
      title: "امنیت شبکه",
      text: `تنظیمات فایروال و امنیت شبکه
      ...
      ایجاد ارتباط امن بین دفاتر
      ...
      ارزیابی امنیت شبکه`,

      delay: `${
        windowWidth != undefined && windowWidth <= 1050 ? "delay3" : "delay1"
      }`,
    },
    {
      img: "/images/icon (4).svg",
      title: "مانیتورینگ و مدیریت شبکه",
      text: `مانیتورینگ شبکه
      ...
      مدیریت ترافیک شبکه
      ...
      بهینه سازی عملکرد`,

      delay: `${
        windowWidth != undefined && windowWidth <= 1050 ? "delay3" : "delay2"
      }`,
    },
    {
      img: "/images/icon (3).svg",
      title: "خدمات VOIPو ارتباطات",
      text: `ایجاد  زیرساخت برای ارتباطات VOIP
      ...
      نصب و پیکربندی  سیستم های تلفن گویا
      ...
      دورکاری تحت وب`,

      delay: `${
        windowWidth != undefined && windowWidth <= 1050 ? "delay4" : "delay3"
      }`,
    },
    {
      img: "/images/icon (1).svg",
      title: "خدمات دوربین های مداربسته",
      text: `نصب و پیکربندی دوربین های مداربسته
      ...
      پشتیبانی و نگهداری سیستم های نظارتی
      ...
      اتصال دوربین ها به شبکه`,
      delay: "delay4",
    },
  ];

  const serviceChunks = chunkArray(services, 2);

  // Set the active slide
  const currentSlide = (n: number) => setSlideIndex(n);

  const nextSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex < serviceChunks.length ? prevIndex + 1 : 1
    );
  };

  const prevSlide = () => {
    setSlideIndex((prevIndex) =>
      prevIndex > 1 ? prevIndex - 1 : serviceChunks.length
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

  // Intersection observer for visibility animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Window resize listener for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[70%] mx-auto flex flex-col justify-center items-center my-44
      screen1560:w-[80%] screen1360:w-[90%]"
    >
      <h3
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
        } text-[#333] text-[32px] font-[600] screen690:text-2xl`}
      >
        خدماتی که ارائه میدهیم
      </h3>

      <h6
        className={`${
          isVisible ? `${style.slideUpAnimation} ${style.delay0}` : ""
        } mb-20 text-[#C4161C] text-base  screen690:text-base`}
      >
        خدمات شبکه ای
      </h6>

      <div
        style={{ direction: "rtl" }}
        className="grid w-full mx-auto grid-cols-4 gap-6
        screen1050:w-[80%]
        screen1000:w-[85%]
        screen770:w-[100%]
      
        screen1050:grid-cols-2 screen1050:mx-auto screen630:hidden"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className={`${
              isVisible
                ? `${style.slideUpAnimation} ${style[service.delay]}`
                : ""
            }`}
          >
            <ServiceDetails
              img={service.img}
              title={service.title}
              text={service.text}
            />
          </div>
        ))}
      </div>

      <div
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        className={` ${styles.slider} ${styles.slideshowContainer} hidden screen630:grid screen630:w-full place-items-center mx-auto`}
      >
        {serviceChunks.map((chunk, index) => (
          <div
            key={index}
            className={`w-full mx-auto place-items-center ${styles.mySlides} ${
              styles.slides
            }  ${slideIndex === index + 1 ? styles.fade : ""}`}
            style={{ display: slideIndex === index + 1 ? "block" : "none" }}
          >
            {chunk.map((service, idx) => (
              <ServiceDetails
                key={idx}
                img={service.img}
                title={service.title}
                text={service.text}
              />
            ))}
          </div>
        ))}

        <div style={{ textAlign: "center" }}>
          {serviceChunks.map((_, index) => (
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
