"use client";
import React, { useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

import style from "@/components/shared/style.module.css";

import icon1 from "@/public/images/new/net-icon-5.png";
import icon2 from "@/public/images/new/net-icon-6.png";
import icon3 from "@/public/images/new/net-icon-7.png";
import icon4 from "@/public/images/new/net-icon-8.png";

type Item = {
  id: number;
  title: string;
  text: string;
  img: StaticImageData;
};

const items: Item[] = [
  {
    id: 1,
    title: "اپلیکیشن ExHub (برای دسکتاپ)",
    text: "این نرم‌افزار برای دسکتاپ طراحی شده و به صرافی‌ها امکان مدیریت یکپارچه  تمامی تراکنش‌های ارزی، موجودی‌ها، و ارتباطات با مشتریان را فراهم می‌کند. ExHub با ارائه گزارشات دقیق و قابلیت‌های پیشرفته، به افزایش بهره‌وری و  کاهش خطاهای انسانی کمک می‌کند.",
    img: icon1,
  },
  {
    id: 2,
    title: "اپلیکیشن نرخ",
    text: "این اپلیکیشن به صرافی‌ها امکان می‌دهد تا نرخ‌های ارز را به صورت لحظه‌ای  به مشتریان خود اعلام کنند. کاربران می‌توانند با استفاده از این اپلیکیشن  نرخ‌های خرید و فروش ارزهای مختلف را مشاهده و با نوتیفیکیشن‌های فوری از  تغییرات نرخ مطلع شوند.",
    img: icon4,
  },
  {
    id: 3,
    title: "ربات تلگرام",
    text: "ربات تلگرام به صرافی‌ها این امکان را می‌دهد تا از طریق پلتفرم تلگرام با  مشتریان خود در ارتباط باشند. کاربران می‌توانند از طریق این ربات نرخ‌های  ارز، آخرین اخبار و اطلاعات صرافی، و وضعیت تراکنش‌های خود را دریافت کنند.",
    img: icon3,
  },
  {
    id: 4,
    title: "تابلو صرافی",
    text: "تابلو صرافی یک نمایشگر دیجیتال است که نرخ‌های لحظه‌ای ارزها را به صورت بزرگ و واضح در محل صرافی نمایش می‌دهد. این تابلوها با طراحی مدرن و کاربری  آسان، به صرافی‌ها کمک می‌کنند تا به مشتریان خود اطلاعات دقیقی از نرخ‌ها  ارائه دهند.",
    img: icon2,
  },
];

const SecondChildDetails = () => {
  const [selectedId, setSelectedId] = useState<number>(1);

  const handleClick = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div className="my-20 ">
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
                  className="mx-auto my-auto"
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

export default SecondChildDetails;
