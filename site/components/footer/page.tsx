"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  // const [todayVisitorsState, setTodayVisitorsState] = useState<number>(0);
  // const [totalVisitorsState, setTotalVisitorsState] = useState<number>(0);

  // useEffect(() => {
  //   const getAllVisits = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/getAllVisits`
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         setTodayVisitorsState(data?.allTodayVisitors);
  //         setTotalVisitorsState(data?.total);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch visitor data:", error);
  //     }
  //   };

  //   getAllVisits();
  // }, []);

  return (
    <div className="bg-black">
      <div
        style={{ direction: "rtl" }}
        className="grid grid-cols-4 text-[#DEDEDE] pt-20 pb-14 w-[85%] mx-auto
          screen705:w-[93%]
          screen705:pt-12
          screen705:pb-8
          screen950:grid-cols-3
          screen690:grid-cols-1
          screen690:place-items-center"
      >
        <div className="my-auto mx-auto">
          <Image
            src="/images/Telmis-Logo-Red.png"
            alt="لوگوی شرکت داده پردازان تلمیس"
            className="mx-auto screen950:w-28 screen690:w-32"
            width={100}
            height={100}
          />
          <h3
            className="my-10 tracking-wider whitespace-nowrap text-justify screen1100:tracking-normal screen1000:px-2 screen950:text-sm screen690:px-0 screen690:text-sm 
            screen690:text-center screen690:tracking-wider screen750:text-xs"
          >
            از صفر تا یک همراه شما هستیم.
          </h3>
          <div className="flex flex-row justify-between w-2/3 mx-auto screen690:w-[80%]">
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.telmis.ir"
              className="group"
            >
              <Image
                alt="واتس اپ شرکت داده پردازان تلمیس"
                src="/images/footer-whatsApp.svg"
                className="w-6 h-6 screen950:w-5 screen950:h-5 screen690:w-6 screen690:h-6 transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert"
                width={24}
                height={24}
              />
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.telmis.ir"
              className="group"
            >
              <Image
                alt="اینستاگرام شرکت داده پردازان تلمیس"
                src="/images/footer-Instagram.svg"
                className="w-6 h-6 screen950:w-5 screen950:h-5 screen690:w-6 screen690:h-6 transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert"
                width={24}
                height={24}
              />
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.telmis.ir"
              className="group"
            >
              <Image
                alt="تلگرام شرکت داده پردازان تلمیس"
                src="/images/footer-Telegram.svg"
                className="w-6 h-6 screen950:w-5 screen950:h-5 screen690:w-6 screen690:h-6 transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert"
                width={24}
                height={24}
              />
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.telmis.ir"
              className="group"
            >
              <Image
                alt="لینکداین شرکت داده پردازان تلمیس"
                src="/images/footer-linkedIn.svg"
                className="w-6 h-6 screen950:w-5 screen950:h-5 screen690:w-6 screen690:h-6 transition duration-300 ease-in-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
        <div className="my-auto text-right pr-2 text-sm grid grid-cols-1 gap-3 screen950:text-xs screen950:hidden">
          <div className="font-bold text-base mb-2 screen950:text-sm">
            خدمات
          </div>
          <Link href="/services/network" className=" hover:text-red-500 ">
            <div>خدمات شبکه</div>
          </Link>
          <Link href="/services/web-app" className=" hover:text-red-500 ">
            <div>توسعه دیجیتال</div>
          </Link>

          <Link href="/services/camera" className="hover:text-red-500">
            <div>دوربین مداربسته</div>
          </Link>
          <Link href="/exchange" className=" hover:text-red-500 ">
            <div>خدمات صرافی</div>
          </Link>
          <Link href="#exchange" className=" hover:text-red-500 ">
            <div>اپلیکیشن Exhub</div>
          </Link>
        </div>
        <div className="my-auto text-right pr-2 text-sm grid grid-cols-1 gap-3 screen950:text-xs screen950:mr-10 screen690:hidden">
          <div className="font-bold text-base mb-2 screen950:text-sm">
            دسترسی سریع
          </div>
          <div className=" hover:text-red-500 ">
            <Link href="/">خانه</Link>
          </div>
          <div className=" hover:text-red-500 ">
            <Link href="/about-us">درباره ما</Link>
          </div>
          <div className=" hover:text-red-500 ">
            <Link href="/contact-us">تماس با ما</Link>
          </div>
          <div className=" hover:text-red-500 ">
            <Link href="/">فروشگاه</Link>
          </div>
          <div className=" hover:text-red-500 ">
            <Link href="/#certificates">مجوز ها وگواهی ها</Link>
          </div>
        </div>
        <div className="my-auto text-right pr-2 text-sm grid grid-cols-1 gap-3 screen950:text-xs screen690:place-items-center screen690:mt-10">
          <div className="font-bold text-base mb-2 screen950:text-sm">
            اطلاعات تماس
          </div>
          <div className="flex flex-row screen690:flex-col screen690:place-items-center">
            <Image
              alt="تلفن"
              src="/images/phone.svg"
              className="w-4 h-4 my-auto ml-2 screen690:ml-0 screen690:mb-3"
              width={16}
              height={16}
            />
            <div style={{ direction: "ltr" }}>021 - 91303343</div>
          </div>
          <div className="flex flex-row screen690:flex-col screen690:place-items-center">
            <Image
              alt="ایمیل"
              src="/images/mail.svg"
              className="w-4 h-4 my-auto ml-2 screen690:ml-0 screen690:mb-3"
              width={16}
              height={16}
            />
            <div>info@telmis.ir</div>
          </div>
          <div className="flex flex-row screen690:flex-col screen690:place-items-center">
            <Image
              src="/images/location.svg"
              alt="آدرس"
              className="w-5 h-5 my-auto ml-1 screen690:ml-0 screen690:mb-3"
              width={20}
              height={20}
            />
            <div
              className="w-[80%] screen950:w-full screen690:w-[60%] screen690:text-center screen690:leading-6
            screen500:w-[75%]
            "
            >
              میرداماد ، خیابان شمس تبریزی شمالی ، کوچه نیک‌‍ رای ، پلاک‌3 ،
              طبقه اول ، واحد‌2
            </div>
          </div>
        </div>
      </div>

      <div className="text-[#CACACA] border-t border-[#CACACA] py-4 w-[80%] mx-auto  text-center screen950:text-sm">
        <span className="mx-auto">طراحی و توسعه توسط &nbsp;</span>
        <span className="text-[#B71F26] mx-auto">تلمیس</span>
      </div>

      {/* <div className="text-gray-700 flex justify-between text-[5px]">
        <span>{todayVisitorsState}</span>
        <span>{totalVisitorsState}</span>
      </div> */}
    </div>
  );
};

export default Footer;
