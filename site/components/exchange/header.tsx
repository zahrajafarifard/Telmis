import React from "react";
import { PeydaBlack } from "@/app/layout";

import ContinueButton from "../shared/continue-button/page";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.backgroundImage}>
      <div
        className="grid grid-cols-2 mr-[10%]  screen890:mr-[5%] py-60
          screen690:grid-cols-1 
          screen690:mr-0
          screen1680:py-56
          screen1650:py-48
          screen1250:py-36
          screen1100:py-28
          screen890:py-24"
      >
        <div></div>

        <div className="my-auto flex flex-col place-items-end w-full screen690:place-items-center">
          <h1
            className={`text-[50px] font-[800]  mb-6 text-[#fff] text-right  ${PeydaBlack.className} whitespace-nowrap
              screen705:whitespace-normal
              screen1460:text-[45px] 
              screen1200:text-[42px]
              screen1100:text-[40px]
              screen1100:mb-3
              screen890:mb-2
              screen890:text-[34px]
              screen690:text-[41px]
              screen690:-mt-14
              screen690:mb-6
              screen690:text-center
              screen550:text-[37px]
              screen400:text-[34px]
          `}
          >
            خدمات و محصولات برای صرافی ها
          </h1>
          <h4
            style={{ direction: "rtl" }}
            className="text-2xl text-[#fff] w-2/3 text-justify   screen1360:w-[85%]
              screen1200:text-[21px]
              screen1100:text-lg
              screen890:text-[17px]
              screen890:w-[90%]
              screen690:text-base
              screen690:leading-[31px]
              screen690:-tracking-[0.16px]
              screen690:mb-6
              screen690:text-center "
          >
            با تخصص و سابقه‌ای درخشان، تیم ما بهترین خدمات اختصاصی را به
            صرافی‌ها ارائه می‌دهد. با اعتماد به ما، از خدمات بی‌نظیر ما بهره‌مند
            شوید. همیشه در کنار شما هستیم.
          </h4>

          <ContinueButton link="#exchange" />
        </div>
      </div>
    </div>
  );
};

export default Header;
