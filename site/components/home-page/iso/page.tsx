import React from "react";
import Image from "next/image";

import certificate1 from "@/public/images/logo (1).png";
import certificate2 from "@/public/images/logo (2).png";
import certificate3 from "@/public/images/logo (3).png";
import certificate4 from "@/public/images/logo (4).png";
import certificate5 from "@/public/images/logo (5).png";
import certificate6 from "@/public/images/logo (6).png";

const ISO = () => {
  return (
    <div
      id="certificates"
      className="w-[70%] mx-auto mt-10 screen1360:w-[80%] screen690:w-[90%] screen550:w-[95%] "
    >
      <div className="flex flex-row justify-between">
        <Image
          src={certificate1}
          width={90}
          height={90}
          alt="iso 27001"
          className="screen890:w-[80px] screen890:h-[80px]  screen690:w-[70px] screen690:h-[70px] 
          screen550:w-[60px] screen550:h-[60px] screen450:w-[50px] screen450:h-[50px] screen350:w-[45px] screen350:h-[45px] "
        />
        <Image
          src={certificate2}
          width={90}
          height={90}
          alt="iso 9001"
          className="screen890:w-[80px] screen890:h-[80px] screen690:w-[70px] screen690:h-[70px] 
          screen550:w-[60px] screen550:h-[60px] screen450:w-[50px] screen450:h-[50px] screen350:w-[45px] screen350:h-[45px] "
        />
        <Image
          src={certificate3}
          width={90}
          height={90}
          alt=" گواهی نظام صنفی یارانه ای"
          className="screen890:w-[80px] screen890:h-[80px] screen690:w-[70px] screen690:h-[70px] 
          screen550:w-[60px] screen550:h-[60px] screen450:w-[50px] screen450:h-[50px] screen350:w-[45px] screen350:h-[45px] "
        />
        <Image
          src={certificate4}
          width={90}
          height={90}
          alt="گواهی شورای عالی انفورماتیک"
          className="screen890:w-[80px] screen890:h-[80px] screen690:w-[70px] screen690:h-[70px] 
          screen550:w-[60px] screen550:h-[60px] screen450:w-[50px] screen450:h-[50px] screen350:w-[45px] screen350:h-[45px] "
        />
        <Image
          src={certificate5}
          width={90}
          height={90}
          alt="گواهی اتاق بازرگانی"
          className="screen890:w-[80px] screen890:h-[80px]  screen690:w-[70px] screen690:h-[70px] 
          screen550:w-[60px] screen550:h-[60px] screen450:w-[50px] screen450:h-[50px] screen350:w-[45px] screen350:h-[45px] "
        />
        <Image
          src={certificate6}
          width={90}
          height={90}
          alt="گواهی انجمن رمز ارز"
          className="screen890:w-[80px] screen890:h-[80px]  screen690:w-[70px] screen690:h-[70px] 
          screen550:w-[60px] screen550:h-[60px] screen450:w-[50px] screen450:h-[50px] screen350:w-[45px] screen350:h-[45px] "
        />
      </div>
    </div>
  );
};

export default ISO;
