import React from "react";
import Image from "next/image";
import style from "./style.module.css";
import Link from "next/link";

const FirstChild = () => {
  return (
    <div
      className="mt-28 w-[70%] mx-auto
        screen1360:w-[80%] screen690:w-[90%] "
    >
      <div className="flex flex-row justify-between screen950:flex-col ">
        <div
          className={`${style.slideUpAnimation} ${style.delay0} rounded-[20px] overflow-hidden  w-[60%] screen950:w-[80%]  bg-[#d4d3d3]
          screen950:h-[400px]
          screen950:mx-auto  screen550:w-full `}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12950.533767173212!2d51.43793277052969!3d35.75981337592794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e05a0bd21a645%3A0x4223c998814d7fb6!2z2K_Yp9iv2Ycg2b7Ysdiv2KfYstin2YYg2KrZhNmF24zYsw!5e0!3m2!1sen!2s!4v1731916084168!5m2!1sen!2s"
            style={{ border: 0, width: "100%", height: "100%" }}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="w-[40%] my-auto screen950:w-[80%] screen950:mx-auto screen950:mt-14 screen550:w-[90%] ">
          <Image
            src="/images/contact-location.svg"
            width={24}
            height={34}
            alt="آدرس شرکت داده پردازان تلمیس"
            className={`${style.slideUpAnimation} ${style.delay0} mx-auto`}
          />
          <p
            className={`${style.slideUpAnimation} ${style.delay0}  text-center w-1/2 mx-auto text-[#221D23] text-lg leading-[240%] mb-8
            screen1200:mb-6
            screen1460:w-[90%]
            screen1050:text-base
            screen1050:leading-[200%]
            screen950:text-lg
            screen950:leading-[240%]
            screen950:w-[90%]
             screen950:mb-8 `}
          >
            میرداماد ، خیابان شمس تبریزی شمالی ، کوچه نیک رای ، پلاک3 ، طبقه اول
            ، واحد2
          </p>
          <Image
            src="/images/contact-phone.svg"
            width={24}
            height={34}
            alt="شماره تلفن  شرکت داده پردازان تلمیس"
            className={`${style.slideUpAnimation} ${style.delay1} mx-auto mb-3`}
          />
          <p
            className={`${style.slideUpAnimation} ${style.delay1}  text-center text-[#221D23] text-lg mb-8 
              screen1200:mb-6 screen1050:text-base screen950:text-lg screen950:mb-8 `}
          >
            021 - 91303343
          </p>
          <Image
            src="/images/contact-mail.svg"
            width={24}
            height={34}
            alt="ایمیل شرکت داده پردازان تلمیس"
            className={`${style.slideUpAnimation} ${style.delay2} mx-auto mb-3`}
          />
          <p
            className={`${style.slideUpAnimation} ${style.delay2} text-center text-[#221D23] text-lg mb-8
              screen1200:mb-6 screen1050:text-base screen950:text-lg screen950:mb-8 `}
          >
            info@telmis.ir
          </p>

          <div
            className={`${style.slideUpAnimation} ${style.delay3} w-2/3 flex flex-row justify-between my-10 mx-auto 
              screen1200:my-7
              screen1200:w-[70%]
              screen1050:my-4
              screen950:w-[50%]
              screen950:mt-10
              screen950:mb-0
              screen630:w-[60%]
              screen550:w-[70%]
              screen400:w-[80%]  `}
          >
            <Link href="https://telmis.ir" target="_blank">
              <div className="bg-[#A60014] rounded-full p-2 group hover:bg-[#FFDA8A]">
                <Image
                  src="/images/linkedIn.svg"
                  width={40}
                  height={40}
                  alt="لینکداین شرکت داده پردازان تلمیس"
                  className="brightness-0 invert screen1200:w-[30px] screen1200:h-[30px] group-hover:brightness-0 group-hover:invert-0"
                />
              </div>
            </Link>
            <Link href="https://telmis.ir" target="_blank">
              <div className="bg-[#A60014] rounded-full p-2 group hover:bg-[#FFDA8A]">
                <Image
                  src="/images/telegram.svg"
                  width={40}
                  height={40}
                  alt="تلگرام شرکت داده پردازان تلمیس"
                  className="brightness-0 invert screen1200:w-[30px] screen1200:h-[30px] group-hover:brightness-0 group-hover:invert-0"
                />
              </div>
            </Link>
            <Link href="https://telmis.ir" target="_blank">
              <div className="bg-[#A60014] rounded-full p-2 group hover:bg-[#FFDA8A]">
                <Image
                  src="/images/insta.svg"
                  width={40}
                  height={40}
                  alt="اینستاگرام شرکت داده پردازان تلمیس"
                  className="brightness-0 invert screen1200:w-[30px] screen1200:h-[30px] group-hover:brightness-0 group-hover:invert-0"
                />
              </div>
            </Link>
            <Link href="https://telmis.ir" target="_blank">
              <div className="bg-[#A60014] rounded-full p-2 group hover:bg-[#FFDA8A]">
                <Image
                  src="/images/whatsApp.svg"
                  width={40}
                  height={40}
                  alt="واتس اپ شرکت داده پردازان تلمیس"
                  className="brightness-0 invert screen1200:w-[30px] screen1200:h-[30px] group-hover:brightness-0 group-hover:invert-0"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstChild;
