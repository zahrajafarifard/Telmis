"use client";
import React, { useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import style from "@/components/shared/style.module.css";

import icon1 from "@/public/images/new/net-icon-1.png";
import icon2 from "@/public/images/new/net-icon-2.png";
import icon3 from "@/public/images/new/net-icon-3.png";
import icon4 from "@/public/images/new/net-icon-4.png";

type Item = {
  id: number;
  title: string;
  text: string;
  img: StaticImageData;
};

const items: Item[] = [
  {
    id: 1,
    title: "اجرای الزامات امنیت شبکه",
    text: "اجرای الزامات امنیت شبکه به مجموعه اقداماتی گفته می‌شود که برای محافظت  از اطلاعات و منابع شبکه در برابر تهدیدات و حملات سایبری انجام می‌شود.  الزاماتی که شامل استفاده از فایروال‌ها، سیستم‌های تشخیص و جلوگیری از  نفوذ، رمزنگاری داده‌ها، احراز هویت کاربران، و اجرای سیاست‌های امنیتی  دقیق است. هدف از این الزامات، اطمینان از محرمانگی، یکپارچگی، و دسترسی به اطلاعات شبکه صرافی‌ها می‌باشد.",
    img: icon1,
  },
  {
    id: 2,
    title: "نگهداری شبکه و پشتیبانی",
    text: "نگهداری شبکه و پشتیبانی شامل فعالیت‌هایی است که به منظور حفظ عملکرد  بهینه و بدون وقفه شبکه‌های کامپیوتری انجام می‌شود. این فعالیت‌ها شامل  به‌روزرسانی نرم‌افزارها و سخت‌افزارها، پشتیبان‌گیری از داده‌ها، رفع  مشکلات و عیب‌یابی، و مدیریت ترافیک شبکه است. هدف اصلی از نگهداری و  پشتیبانی شبکه، اطمینان از کارکرد صحیح و پایدار سیستم‌ها و جلوگیری از  بروز مشکلات احتمالی است.",
    img: icon2,
  },
  {
    id: 3,
    title: "پایش و مانیتورینگ",
    text: "پایش و مانیتورینگ به فرآیند مداوم نظارت بر عملکرد و سلامت شبکه‌های  کامپیوتری و سرویس‌های مرتبط اطلاق می‌شود. این فرآیند شامل جمع‌آوری و  تحلیل داده‌ها، شناسایی و هشدار دهی در مورد ناهنجاری‌ها، و اطمینان از  عملکرد بهینه سیستم‌ها است. ابزارهای مانیتورینگ مختلفی برای بررسی وضعیت  سرورها، سوئیچ‌ها، روترها، و سایر تجهیزات شبکه مورد استفاده قرار می‌گیرند تا هر گونه مشکل یا نقص به سرعت شناسایی و برطرف شود.",
    img: icon3,
  },
  {
    id: 4,
    title: "خدمات نورونتا",
    text: "خدمات نورونتا به مجموعه خدماتی در زمینه شبکه و اینترنت اشاره دارد که به  بهبود عملکرد و امنیت شبکه‌ها کمک می‌کند. این خدمات شامل ارائه پهنای باند اختصاصی، مدیریت ترافیک شبکه، تامین امنیت سایبری، و بهینه‌سازی ارتباطات  اینترنتی است. نورونتا با استفاده از فناوری‌های پیشرفته و تیم‌های متخصص،  به کسب‌وکارها در مدیریت شبکه‌هایشان با کارایی بالا و امنیت بهینه یاری  می‌رساند و کیفیت ارتباطات اینترنتی را بهبود می‌بخشد.",
    img: icon4,
  },
];

const FirstChildDetails = () => {
  const [selectedId, setSelectedId] = useState<number>(1);

  const handleClick = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div className="my-20">
      <div className="flex flex-row">
        <div className="w-[10%]">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center relative">
              <div
                onClick={() => handleClick(item.id)}
                className={`w-fit rounded-lg cursor-pointer ${
                  selectedId === item.id
                    ? "bg-[#C4161C] p-2"
                    : "bg-[#F2F2F3] p-2"
                }`}
              >
                <Image
                  src="/images/Vector.svg"
                  width={40}
                  height={40}
                  alt="icon"
                  className={` ${
                    selectedId === item.id && "brightness-0 invert"
                  }`}
                />
              </div>

              <div
                onClick={() => handleClick(item.id)}
                className={`text-center mt-2 absolute right-full  whitespace-nowrap text-xl font-semibold cursor-pointer ${style.textColor} `}
              >
                {item.title}
              </div>
              <div
                className={`w-0.5 relative ${
                  index + 1 === selectedId
                    ? "h-44"
                    : index !== 3
                    ? "h-14"
                    : "h-0"
                } bg-[#C4161C]`}
              >
                {selectedId === item.id && index === items.length - 1 && (
                  <div className="w-6 h-0.5 mx-auto border absolute bottom-0 -left-3 border-[#C4161C]" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-[90%]">
          {selectedId !== null && (
            <div
              style={{ marginTop: `${(selectedId - 1) * 110}px` }}
              className="text-center"
            >
              <div className="flex flex-row -mr-8 pt-16">
                <Image
                  src={items[selectedId - 1].img}
                  width={60}
                  height={60}
                  alt="image"
                  className="my-auto mx-auto"
                />
                <p className="text-gray-700 text-justify pr-4 my-auto">
                  {items[selectedId - 1].text}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstChildDetails;
