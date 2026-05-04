import React from "react";
import { PeydaBlack } from "@/app/layout";

import ContinueButton from "@/components/shared/continue-button/page";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.backgroundImage}>
      <div
        className="grid grid-cols-2 mr-[10%] py-60
          screen890:mr-[5%]
          screen690:grid-cols-1 
          screen690:mr-0
          screen1680:py-56
          screen1650:py-48
          screen1250:py-36
          screen1100:py-28
          screen890:py-24 "
      >
        <div></div>

        <div className="my-auto flex flex-col place-items-end w-full screen690:place-items-center">
          <h1
            className={`text-[50px] font-[800]  mb-6 text-[#fff]  ${PeydaBlack.className}
              screen1200:text-[47px]
              screen1100:text-[40px]
              screen1100:mb-3
              screen890:mb-2
              screen890:text-[27px]
              screen690:text-[41px]
              screen690:-mt-14
              screen690:mb-6
              screen550:text-[37px]
              screen400:text-[34px] `}
          >
            دوربین های مداربسته
          </h1>
          <h4
            style={{ direction: "rtl" }}
            className="text-2xl text-[#fff] w-2/3 text-justify  leading-[38px] -tracking-[0.24px]
              screen1360:w-[85%]
              screen1200:text-[21px]
              screen1100:text-lg
              screen890:text-[15px]
              screen890:w-[90%]
              screen690:text-base
              screen690:leading-[31px]
              screen690:-tracking-[0.16px]
              screen690:mb-6 "
          >
            ما با ارائه بهترین دوربین‌های مداربسته، نصب و پشتیبانی حرفه‌ای، و
            راهکارهای نظارتی پیشرفته متصل به شبکه، امنیت شما را تضمین می‌کنیم.
            از مشاوره اولیه تا نصب و نگهداری، تیم متخصص ما در تمامی مراحل کنار
            شماست تا از آرامش خاطر بهره‌مند شوید. با بهره‌گیری از تکنولوژی‌های
            مدرن و خدمات متنوع ما، هیچ نگرانی از بابت امنیت نخواهید داشت.
          </h4>

          <ContinueButton link="#camera" />
        </div>
      </div>
    </div>
  );
};

export default Header;
