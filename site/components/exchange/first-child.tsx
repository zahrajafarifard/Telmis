"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import FirstChildDetails from "./first-child-details";
import FirstChildDetailsSmall from "./first-child-details-small-screen";
import SecondChildDetails from "./second-child-details";
import SecondChildDetailsSmall from "./second-child-details-small-screen";
import style from "./style.module.css";

const FirstChild = () => {
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [showItem, setShowItem] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowContent = width < 1000 || !showItem;

  return (
    <div
      id="exchange"
      className="w-[70%] mx-auto my-40
        screen1360:w-[80%] screen690:w-[90%] "
    >
      <div className="flex flex-row screen1000:flex-col-reverse ">
        <div
          className={` flex flex-col place-items-end screen1000:place-items-center 
            ${
              showItem
                ? "w-0 transition-all duration-1000 ease-in-out screen1000:transition-none screen1000:w-full screen1000:mt-10"
                : "w-1/2 screen1000:w-full screen1000:mt-14"
            }`}
        >
          {shouldShowContent && selectedItem === 2 && (
            <>
              <h3 className="text-[#221D23] text-2xl font-bold mb-4 text-right screen1200:text-xl">
                خدمات اختصاصی تلمیس برای صرافی ها
              </h3>
              <h5
                style={{ direction: "rtl" }}
                className="text-justify text-[#919191] text-lg leading-[190%] screen1200:text-base screen1000:text-center"
              >
                با تخصص و سابقه‌ای درخشان، تیم ما بهترین خدمات اختصاصی را به
                صرافی‌ها ارائه می‌دهد. با اعتماد به ما، از خدمات بی‌نظیر ما
                بهره‌مند شوید. همیشه در کنار شما هستیم.
              </h5>
            </>
          )}
          {shouldShowContent && (selectedItem === 0 || selectedItem === 1) && (
            <>
              <h3 className="text-[#221D23] text-2xl font-bold mb-4 text-right screen1200:text-xl ">
                محصولات اختصاصی تلمیس برای صرافی ها
              </h3>
              <h5
                style={{ direction: "rtl" }}
                className="text-justify text-[#919191] text-lg leading-[190%] screen1200:text-base screen1000:text-center"
              >
                با راهکارهای ما، تجربه‌ای مدرن و کارآمد را به مشتریان خود ارائه
                دهید و با اطمینان در بازار رقابتی امروز پیشتاز باشید.
              </h5>
            </>
          )}
          {shouldShowContent && (
            <div
              onClick={() => {
                setShowItem(true);
              }}
              className={`w-fit cursor-pointer text-lg text-white rounded-full py-3 px-20 bg-[#A60014]  mt-10  relative overflow-hidden group
                ${showItem ? style.bgGradient : "bg-[#A60014]"}
                screen1200:text-base screen1200:py-2 screen1200:px-12`}
            >
              <span
                className={`absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 
                rounded-full group-hover:opacity-100 group-hover:scale-150
                bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E] `}
              ></span>
              <span className="relative z-0">مطالعه بیشتر</span>
            </div>
          )}
        </div>

        <div
          onClick={() => {
            setShowItem(false);
          }}
          className={`w-fi t flex flex-col  ${
            showItem
              ? " w-full mx-auto items-center transition-all duration-1000 ease-in-out screen1000:transition-none"
              : "justify-end items-end"
          }`}
        >
          <Image
            src="/images/ex.png"
            width={650}
            height={400}
            alt="صرافی"
            className={`w-full rounded-3xl
              ${
                showItem
                  ? "h-[350px] screen1000:h-[250px] screen450:h-[180px]"
                  : "h-[250px] px-20 screen1540:px-10 screen1000:px-0 screen450:h-[180px]"
              }
              `}
          />

          <div
            className={`flex flex-row  w-full mx-auto -mt-20 screen400:-mt-14  ${
              showItem
                ? "items-start screen1000:justify-center"
                : "justify-center px-20 space-x-5 screen690:px-8 "
            }`}
          >
            <div
              onClick={() => setSelectedItem(2)}
              className={`flex flex-col justify-center py-4  screen1100:py-3 screen400:py-2
                ${
                  showItem
                    ? `w-1/5 ms-40 screen1440:ms-20 screen1100:w-1/4 screen1000:ms-0 screen1000:w-[200px] screen630:w-[170px] screen550:w-[150px] 
                    screen500:w-[140px] screen400:w-[120px] `
                    : `w-1/3 screen1360:w-[40%] screen1100:w-[45%] screen1000:w-[200px] screen630:w-[170px] screen550:w-[150px] screen500:w-[140px] screen400:w-[120px]`
                }
                ${selectedItem === 2 ? style.bgRed : style.bgWhite}`}
            >
              <Image
                src="/images/prod-ex.svg"
                width={50}
                height={50}
                alt="محصولات صرافی"
                className={`mx-auto  mb-2 screen690:w-[35px] screen690:h-[35px]  screen450:w-[30px] screen450:h-[35px] screen450:mb-1 ${
                  selectedItem !== 2 && "brightness-0 invert-0"
                }`}
              />
              <p
                className={` mx-auto text-center text-sm w-[100%] screen1360:w-[90%] screen400:text-xs
                ${selectedItem === 2 ? "text-white" : "text-[#221D23]"}
                `}
              >
                محصولات اختصاصی تلمیس برای صرافی ها
              </p>
            </div>

            <div
              onClick={() => setSelectedItem(1)}
              className={`flex flex-col justify-between py-4 screen1100:py-3  screen400:py-2
                ${
                  showItem
                    ? "w-1/5 ms-10 screen1440:ms-5 screen1100:w-1/4 screen1000:w-[200px] screen630:w-[170px] screen550:w-[150px] screen500:w-[140px] screen400:w-[120px]"
                    : "w-1/3 screen1360:w-[40%] screen1100:w-[45%] screen1000:w-[200px] screen630:w-[170px] screen550:w-[150px] screen500:w-[140px] screen400:w-[120px]"
                }
                ${
                  selectedItem === 0 || selectedItem === 1
                    ? style.bgRed
                    : style.bgWhite
                }`}
            >
              <Image
                src="/images/ser-ex.svg"
                width={50}
                height={50}
                alt="خدمات صرافی"
                className={`mx-auto mb-2 screen690:w-[35px] screen690:h-[35px] screen450:w-[30px] screen450:h-[35px] screen450:mb-1 ${
                  selectedItem !== 2 && "brightness-0 invert"
                }`}
              />
              <p
                className={` mx-auto text-center text-sm  w-[100%] screen1360:w-[90%] screen400:text-xs ${
                  selectedItem === 0 || selectedItem === 1
                    ? "text-white"
                    : "text-[#221D23]"
                }`}
              >
                خدمات اختصاصی تلمیس برای صرافی ها
              </p>
            </div>
          </div>
        </div>
      </div>

      {showItem &&
        (selectedItem === 0 || selectedItem === 1) &&
        width >= 1000 && (
          <div style={{ direction: "rtl" }} className="w-full mx-auto">
            <FirstChildDetails />
          </div>
        )}
      {showItem && selectedItem === 2 && width >= 1000 && (
        <div style={{ direction: "rtl" }} className="w-full mx-auto">
          <SecondChildDetails />
        </div>
      )}
      {showItem &&
        (selectedItem === 0 || selectedItem === 1) &&
        width < 1000 && (
          <div style={{ direction: "rtl" }} className="w-full mx-auto">
            <FirstChildDetailsSmall />
          </div>
        )}
      {showItem && selectedItem === 2 && width < 1000 && (
        <div style={{ direction: "rtl" }} className="w-full mx-auto">
          <SecondChildDetailsSmall />
        </div>
      )}
    </div>
  );
};

export default FirstChild;
