import React, { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import style from "./header.module.css";

interface Props {
  title: string;
  description: string;
  id: number;
}

const Header: FC<Props> = ({ title, description, id }) => {
  const router = useRouter();

  return (
    <div className={`${style.backgroundImage} py-16 `}>
      <Image
        src="/images/Telmis-Logo-Red.png"
        width={120}
        height={40}
        alt="logo"
        className="mb-7 mx-auto screen890:mb-3"
      />
      <h1
        className="text-[48px] font-bold mb-7 text-[#221D23] text-center 
        screen890:font-semibold
        screen890:leading-[62px]
        screen890:text-[32px]
        screen890:mb-3"
      >
        {title}
      </h1>
      <h4
        style={{ direction: "rtl" }}
        className="text-[24px] text-[#221D23] text-center w-[70%] leading-[37px] mb-7
          screen400:px-3  
          screen890:text-base
          screen890:leading-[37px]
          screen890:mb-3
          screen1250:w-[80%]
          screen750:w-[90%]"
      >
        {description}
      </h4>

      <div
        onClick={async () => {
          console.log("navvvv");

          router.push(`/job-position/upload-resume?title=${title}`);
        }}
        className="relative cursor-pointer overflow-hidden group place-self-end w-fit mx-auto bg-[#A60014] rounded-[50px] text-white text-center px-10 py-2
            screen1000:place-self-center "
      >
        <span
          className="absolute z-10 bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 
              rounded-full group-hover:opacity-100 group-hover:scale-150 
              bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E]"
        ></span>
        <div
          className="relative z-20 text-white text-lg  rounded-[50px] text-center mx-auto
            screen690:text-base
            items-center"
        >
          ارسال رزومه
        </div>
      </div>
    </div>
  );
};

export default Header;
