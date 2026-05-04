import React from "react";
import style from "./style.module.css";
import { StaticImageData } from "next/image";

interface HeaderProps {
  title: string;
  text: string | React.ReactNode;
  image: StaticImageData;
}

const Header: React.FC<HeaderProps> = ({ title, text, image }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${image.src})`,
      }}
      className={`${style.backgroundImage} py-9`}
    >
      <h1 className="text-[48px] font-[800] mb-3 text-[#000] text-center screen890:font-[600] screen890:leading-[62px] screen890:text-[32px]">
        {title}
      </h1>
      <h4
        style={{ direction: "rtl" }}
        className="text-[22px] text-[#fff] text-center screen400:px-3 screen890:text-[18px]"
      >
        <span>{text}</span>
      </h4>
    </div>
  );
};

export default Header;
