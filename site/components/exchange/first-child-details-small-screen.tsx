"use client";
import React, { useState } from "react";
import Image from "next/image";

import style from "./style.module.css";

type Item = {
  id: number;
  title: string;
  text: string;
};

const items: Item[] = [
  {
    id: 1,
    title: "اجرای الزامات امنیت شبکه",
    text: "اجرای الزامات امنیت شبکه به مجموعه اقداماتی گفته می‌شود که برای محافظت  از اطلاعات و منابع شبکه در برابر تهدیدات و حملات سایبری انجام می‌شود.  الزاماتی که شامل استفاده از فایروال‌ها، سیستم‌های تشخیص و جلوگیری از  نفوذ، رمزنگاری داده‌ها، احراز هویت کاربران، و اجرای سیاست‌های امنیتی  دقیق است. هدف از این الزامات، اطمینان از محرمانگی، یکپارچگی، و دسترسی به اطلاعات شبکه صرافی‌ها می‌باشد.",
  },
  {
    id: 2,
    title: "نگهداری شبکه و پشتیبانی",
    text: "نگهداری شبکه و پشتیبانی شامل فعالیت‌هایی است که به منظور حفظ عملکرد  بهینه و بدون وقفه شبکه‌های کامپیوتری انجام می‌شود. این فعالیت‌ها شامل  به‌روزرسانی نرم‌افزارها و سخت‌افزارها، پشتیبان‌گیری از داده‌ها، رفع  مشکلات و عیب‌یابی، و مدیریت ترافیک شبکه است. هدف اصلی از نگهداری و  پشتیبانی شبکه، اطمینان از کارکرد صحیح و پایدار سیستم‌ها و جلوگیری از  بروز مشکلات احتمالی است.",
  },
  {
    id: 3,
    title: "پایش و مانیتورینگ",
    text: "پایش و مانیتورینگ به فرآیند مداوم نظارت بر عملکرد و سلامت شبکه‌های  کامپیوتری و سرویس‌های مرتبط اطلاق می‌شود. این فرآیند شامل جمع‌آوری و  تحلیل داده‌ها، شناسایی و هشدار دهی در مورد ناهنجاری‌ها، و اطمینان از  عملکرد بهینه سیستم‌ها است. ابزارهای مانیتورینگ مختلفی برای بررسی وضعیت  سرورها، سوئیچ‌ها، روترها، و سایر تجهیزات شبکه مورد استفاده قرار می‌گیرند تا هر گونه مشکل یا نقص به سرعت شناسایی و برطرف شود.",
  },
  {
    id: 4,
    title: "خدمات نورونتا",
    text: "خدمات نورونتا به مجموعه خدماتی در زمینه شبکه و اینترنت اشاره دارد که به  بهبود عملکرد و امنیت شبکه‌ها کمک می‌کند. این خدمات شامل ارائه پهنای باند اختصاصی، مدیریت ترافیک شبکه، تامین امنیت سایبری، و بهینه‌سازی ارتباطات  اینترنتی است. نورونتا با استفاده از فناوری‌های پیشرفته و تیم‌های متخصص،  به کسب‌وکارها در مدیریت شبکه‌هایشان با کارایی بالا و امنیت بهینه یاری  می‌رساند و کیفیت ارتباطات اینترنتی را بهبود می‌بخشد.",
  },
];

const FirstChildDetails = () => {
  const [selectedId, setSelectedId] = useState<number>(1);

  const handleClick = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div className="my-20">
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.id} className="">
            <div
              onClick={() => handleClick(item.id)}
              className={`w-full flex flex-row justify-center rounded-lg cursor-pointer my-2 p-2 ${
                selectedId === item.id ? style.bgGradient : "bg-[#F2F2F3] "
              }`}
            >
              <Image
                src="/images/Vector.svg"
                width={30}
                height={30}
                alt="icon"
                className={` ml-2 ${
                  selectedId === item.id && "brightness-0 invert"
                }`}
              />
              <div
                className={` my-auto
                ${selectedId === item.id ? "text-white" : "text-black"}
                `}
              >
                {item.title}
              </div>
            </div>

            {selectedId === item.id && (
              <div className="text-center my-8">
                <div className="flex flex-row ">
                  <p className="text-gray-700 text-justify  my-auto">
                    {items[selectedId - 1].text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstChildDetails;
