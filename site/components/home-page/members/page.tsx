"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";

import MemberDetails from "./member-details";
import style from "./styl.module.css";

const Members = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(event.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    event.preventDefault(); // Prevent text selection
    const x = event.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scrolling speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  return (
    <div className="w-[70%] mx-auto screen1360:w-[80%]">
      <h4 className="text-[#333] text-[32px] text-center font-[600]  mb-2 screen690:text-2xl ">
        اعضای تیم ما
      </h4>
      <Link href="/about-us" prefetch={true}>
        <h6 className="text-base text-[#C4161C] text-center mb-16 underline ">
          برای مطالعه بیشتر کلیک کنید
        </h6>
      </Link>
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{
          direction: "rtl",
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For IE and Edge
        }}
        className={`flex flex-row w-full mx-auto justify-between overflow-x-auto ${style.hiddenScrollbar} `}
      >
        <MemberDetails
          img="/images/team-4.png"
          name="محمد کشتکار"
          position="مدیر تیم شبکه"
          telegram="https://telmis.ir"
          insta="https://telmis.ir"
          linkedIn="https://telmis.ir"
        />
        <div className="screen550:hidd en">
          <MemberDetails
            img="/images/team-3.png"
            name="زهرا جعفری"
            position="برنامه نویس فول استک"
            telegram="https://telmis.ir"
            insta="https://telmis.ir"
            linkedIn="https://telmis.ir"
          />
        </div>
        <div className="screen790:hidde n">
          <MemberDetails
            img="/images/team-1.png"
            name="بهنام استادغلامی"
            position="تولید محتوا"
            telegram="https://telmis.ir"
            insta="https://telmis.ir"
            linkedIn="https://telmis.ir"
          />
        </div>
        <div className="screen1050:hid den">
          <MemberDetails
            img="/images/team-2.png"
            name="عسل حاجی پور"
            position="طراح UI /UX"
            telegram="https://telmis.ir"
            insta="https://telmis.ir"
            linkedIn="https://telmis.ir"
          />
        </div>
      </div>
    </div>
  );
};

export default Members;
