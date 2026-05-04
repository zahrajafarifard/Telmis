import React from "react";
import Link from "next/link";

import styles from "./style.module.css";

const Banner = () => {
  return (
    <div className={`flex flex-row  ${styles.bg} text-white `}>
      <div
        className="w-full pr-[10%]  flex flex-col  items-end py-32 
        screen1000:py-28
        screen890:pr-[6%]
        screen850:py-24
        screen790:py-20
        screen690:py-0
        screen690:items-center
        screen690:pr-0
        screen690:w-[95%]
        screen690:mx-auto "
      >
        <h5
          className="text-2xl screen1270:text-[23px]
          screen690:mt-64 screen690:text-lg screen850:text-[17px] "
        >
          تلمیس، همراه شما در هر لحظه
        </h5>
        <h2
          style={{ direction: "rtl" }}
          className="my-10 text-[48px] screen1460:text-[40px]
            screen1270:text-[32px]
            screen950:text-[29px]
            screen820:text-[26px]
            screen790:text-[23px]
            screen690:text-center
            screen690:my-7
            leading-[47px]
            screen450:text-[28px] "
        >
          برای دریافت مشاوره رایگان با ما تماس بگیرید.
        </h2>

        <div className="red-link-container">
          <span className="red-link-hover-effect"></span>
          <Link href="#contactUs">
            <div className="red-link-text">برای دریافت مشاوره کلیک کنید</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
