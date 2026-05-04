import React from "react";
import style from "./header.module.css";

interface HeaderProps {
  title: string;
  text: string;
}

const Header: React.FC<HeaderProps> = ({ title, text }) => {
  return (
    <div
      className={`${style.backgroundImage} py-32 screen1100:py-28 screen1000:py-20 `}
    >
      <h1
        className="text-[48px] font-[800] mb-6 text-[#fff] text-center screen890:font-[600] screen890:leading-[62px] screen890:text-[32px] 
        screen770:mb-0"
      >
        {title}
      </h1>
      <h4
        style={{ direction: "rtl" }}
        className="text-[22px] text-[#fff] text-center screen400:px-3 screen890:text-[18px]"
      >
        {text}
      </h4>
    </div>
  );
};

export default Header;
