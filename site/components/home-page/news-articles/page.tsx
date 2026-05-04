"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ArticleDetails from "./article-details";
import style from "./style.module.css";

const Article = () => {
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
    <div className={`w-full mx-auto my-44 bg-[#F8F8F8] overflow-hidden `}>
      <div
        ref={containerRef}
        className={`${isVisible ? style.slideUpAnimation : ""}`}
      >
        <h4 className="text-[#333] text-[32px] text-center font-[600] pt-10 mb-2">
          آخرین اخبار و مقالات
        </h4>
        <Link href="/about-us" prefetch={true}>
          <h6 className="text-base text-[#C4161C] text-center mb-16 underline hover:text-[#A60014] cursor-pointer">
            همه مقالات
          </h6>
        </Link>
        <div
          style={{ direction: "rtl" }}
          className="flex flex-row w-[80%] mx-auto justify-between gap-x-10"
        >
          <ArticleDetails
            img="/images/blog-1.png"
            title="امنیت شبکه و رمزنگاری"
            text="اصول مدیریت ریسک در امنیت سایبری"
            athour="نویسنده: عسل حاجی پور"
            date="9 آبان 1403"
          />
          <ArticleDetails
            img="/images/blog-2.png"
            title="معماری شبکه‌ها"
            text="استانداردهای امنیتی SSL/TLS برای ارتباطات امن"
            athour="نویسنده: عسل حاجی پور"
            date="9 آبان 1403"
          />
          <ArticleDetails
            img="/images/blog-1.png"
            title="پروتکل‌های شبکه"
            text="چگونه از شبکه‌های بی‌سیم خود در برابر حملات محافظت کنیم؟"
            athour="نویسنده: عسل حاجی پور"
            date="9 آبان 1403"
          />
        </div>
      </div>
    </div>
  );
};

export default Article;
