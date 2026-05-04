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
    title: "اپلیکیشن ExHub (برای دسکتاپ)",
    text: "این نرم‌افزار برای دسکتاپ طراحی شده و به صرافی‌ها امکان مدیریت یکپارچه  تمامی تراکنش‌های ارزی، موجودی‌ها، و ارتباطات با مشتریان را فراهم می‌کند. ExHub با ارائه گزارشات دقیق و قابلیت‌های پیشرفته، به افزایش بهره‌وری و  کاهش خطاهای انسانی کمک می‌کند.",
  },
  {
    id: 2,
    title: "اپلیکیشن نرخ",
    text: "این اپلیکیشن به صرافی‌ها امکان می‌دهد تا نرخ‌های ارز را به صورت لحظه‌ای  به مشتریان خود اعلام کنند. کاربران می‌توانند با استفاده از این اپلیکیشن  نرخ‌های خرید و فروش ارزهای مختلف را مشاهده و با نوتیفیکیشن‌های فوری از  تغییرات نرخ مطلع شوند.",
  },
  {
    id: 3,
    title: "ربات تلگرام",
    text: "ربات تلگرام به صرافی‌ها این امکان را می‌دهد تا از طریق پلتفرم تلگرام با  مشتریان خود در ارتباط باشند. کاربران می‌توانند از طریق این ربات نرخ‌های  ارز، آخرین اخبار و اطلاعات صرافی، و وضعیت تراکنش‌های خود را دریافت کنند.",
  },
  {
    id: 4,
    title: "تابلو صرافی",
    text: "تابلو صرافی یک نمایشگر دیجیتال است که نرخ‌های لحظه‌ای ارزها را به صورت بزرگ و واضح در محل صرافی نمایش می‌دهد. این تابلوها با طراحی مدرن و کاربری  آسان، به صرافی‌ها کمک می‌کنند تا به مشتریان خود اطلاعات دقیقی از نرخ‌ها  ارائه دهند.",
  },
];

const SecondChildDetails = () => {
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

export default SecondChildDetails;
