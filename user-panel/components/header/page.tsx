"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import moment from "moment-jalaali";

const Header = () => {
  const pathname = usePathname();
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });
  const [now, setNow] = useState<moment.Moment>(moment());

  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(moment());
    }, 10000);

    return () => clearTimeout(timer);
  }, [now]);

  return (
    <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] ">
      <div className="w-[80%] mx-auto flex flex-row justify-between py-7">
        <div className="my-auto flex flex-row-reverse">
          {/* <Image
            src={"/images/header-search.svg"}
            width={37}
            height={37}
            alt=""
            className="mx-4"
          /> */}
          {/* <Image
            src={"/images/header-notif.svg"}
            width={31}
            height={31}
            alt=""
            className="invert "
          /> */}
          {/* <Image
            src={"/images/header-cart.svg"}
            width={38}
            height={38}
            alt=""
            className="mx-4"
          /> */}

          <Link href={"/client/profile"}>
            <div className={`flex flex-row-reverse rounded-[50px] px-8 py-1 ${pathname.includes('/client/profile') ? 'bg-[#FFDA8A]' :'bg-white'}`}>
              <Image
                src={"/images/header-User.Icon.svg"}
                width={29}
                height={29}
                alt=""
              />

              <span className="text-[#A60014] text-xl leading-[42px] pr-2">
                حساب کاربری
              </span>
            </div>
          </Link>
        </div>
        {now && (
          <div
            style={{ direction: "rtl" }}
            className="text-white text-lg leading-[31px] my-auto"
          >
            {`امروز : ${now.format(
              "jDD jMMMM ماه jYYYY"
            )}  ساعت :  ${now.format("HH:mm")}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
