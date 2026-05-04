import React from "react";
import Image from "next/image";

import style from "./style.module.css";

const FirstChild = () => {
  return (
    <div
      className={` ${style.slideUpAnimation}  w-[70%] mx-auto flex flex-row-reverse my-36 border-l-8 border-[#A60014] rounded-[6px]
        screen1360:w-[80%]
        screen950:w-[86%]
        screen890:flex-col-reverse
        screen890:border-0
        screen690:w-[90%]
        screen690:my-20  `}
    >
      <div className="w-1/2 screen890:w-full screen890:mx-auto  flex  justify-end">
        <Image
          src="/images/about (3).png"
          width={500}
          height={500}
          alt="تاریخچه شرکت داده پردازان تلمیس"
          className="screen890:w-full screen890:mx-auto screen890:my-14  rounded-[20px]"
        />
      </div>
      <div
        className="w-1/2 my-auto pr-10 pl-6 screen1460:px-6 screen890:w-full screen890:mx-auto
          screen890:border-l-8 border-[#A60014] rounded-[6px]
          screen890:pr-2 "
      >
        <h3 className="text-[#221D23] text-2xl font-bold text-right mb-2 screen890:mb-5">
          تاریخچه شرکت
        </h3>
        <p
          style={{ direction: "rtl" }}
          className="text-[#7C7C7C] text-lg leading-[190%] text-justify
          screen1440:tracking-tight
          screen1200:text-[17px]
          screen1150:text-base
          screen890:tracking-normal
          screen890:leading-[190%]
          screen400:leading-[160%]
          screen400:-tracking-[0.2px] "
        >
          شرکت ما در سال ۱۳۹۲ با هدف ارائه خدمات تخصصی شبکه و طراحی وبسایت تأسیس
          شد. از همان ابتدا، تمرکز ما بر ارائه راه‌حل‌های نوآورانه و مطمئن در
          حوزه فناوری اطلاعات بود. خدمات ما به گونه‌ای طراحی شده‌اند که بتوانند
          نیازهای تمامی صنایع را پوشش دهند، اما به‌طور ویژه در ارائه خدمات به
          صرافی‌ها تخصص داریم. با گذشت زمان و با تلاش تیمی متعهد و مجرب، موفق به
          اجرای پروژه‌های بزرگ و کوچک در سراسر کشور شده‌ایم. با گسترش دامنه
          خدمات و ارتقاء کیفیت، همواره در مسیر رشد و توسعه قرار داشته و
          توانسته‌ایم جایگاه خود را در صنعت تثبیت کنیم.
        </p>
      </div>
    </div>
  );
};

export default FirstChild;
