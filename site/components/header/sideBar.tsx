"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NavLink from "@/components/shared/navLink";
import style from "./style.module.css";
import menuWhite from "@/public/images/menu-white.svg";
import menuBlack from "@/public/images/menu.svg";

const Sidebar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const [width, setWidth] = useState<number>(0);

  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [showServices, setShowServices] = useState(false);

  return (
    <div className="">
      {!isMenuOpen && (
        <Image
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
          }}
          src={
            pathname === "/"
              ? menuWhite
              : width < 1000 && lastScrollY > 0
              ? menuWhite
              : menuBlack
          }
          alt="منو"
          width={40}
          height={40}
          className={`my-auto absolute right-0 top-7
           ${
             pathname !== "/" && "right-14 screen790:right-[5%]"
           }
           
          
          `}
        />
      )}

      {isMenuOpen && (
        <div
          className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-30 "
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`top-0  w-[100%]  text-center  h-screen   fixed  z-40 ${
          style.bgGradient
        }  ${
          isMenuOpen
            ? "transition duration-1000 ease-in-out translate-x-0 right-0"
            : "transition duration-1000 ease-in-out translate-x-full right-0"
        }`}
      >
        <div className=" flex   pt-10 pb-4  flex-row justify-between  w-[90%] mx-auto">
          <div
            className="flex text-[12px] cursor-pointer "
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
          >
            <Image
              src="/images/Telmis-Logo.png"
              alt="شرکت داده پردازان تلمیس لوگو"
              width={120}
              height={64}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <div
            className="flex text-[12px] cursor-pointer "
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
          >
            <Image
              src="/images/close_ring.svg"
              alt="بستن"
              width={40}
              height={40}
              // style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        <ul
          style={{ direction: "rtl" }}
          className="flex flex-col place-items-start text-lg  duration-700   tracking-tighter  pt-2
          justify-between  "
        >
          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-1 my-2 hover:bg-[#A60014]  w-full"
          >
            <NavLink href="/">خانه</NavLink>
          </li>

          <div
            onClick={() => {
              setShowServices((prev) => !prev);
            }}
            className={`flex flex-row   w-full  py-1.5  my-2 justify-between px-[5%] text-2xl group screen750:text-xl hover:bg-[#A60014] hover:text-white ${
              pathname.includes("/services/") ? "bg-[#A60014] text-white" : ""
            } `}
          >
            خدمات
            <span className=" mr-2 my-auto">
              <span className="my-auto">
                <Image
                  src="/images/Vector 2.svg"
                  className={` mr-2 group-hover:invert ${
                    pathname.includes("services")
                      ? "brightness-0 invert"
                      : "brightness-0 invert-1"
                  }`}
                  alt="فلش پایین"
                  width={13}
                  height={13}
                />
              </span>
            </span>
          </div>

          <ul
            className={` text-[#919191] ${
              showServices || pathname.includes("/services")
                ? "grid px-[5%]"
                : "hidden"
            }`}
          >
            <Link
              onClick={() => {
                setShowServices(false);
                setIsMenuOpen(!isMenuOpen);
              }}
              href="/services/network"
              className={`py-2 w-full text-lg  ${
                pathname === "/services/network" && "text-[#A60014]"
              }`}
            >
              خدمات شبکه
            </Link>
            <Link
              onClick={() => {
                setShowServices(false);
                setIsMenuOpen(!isMenuOpen);
              }}
              href="/services/web-app"
              className={`py-4  w-full text-lg ${
                pathname === "/services/web-app" && "text-[#A60014]"
              }`}
            >
              طراحی وب و اپ
            </Link>
            <Link
              onClick={() => {
                setShowServices(false);
                setIsMenuOpen(!isMenuOpen);
              }}
              href="/services/camera"
              className={`py-4   w-full text-lg ${
                pathname === "/services/camera" && "text-[#A60014]"
              }`}
            >
              دوربین مدار بسته
            </Link>
          </ul>

          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-1 my-2 hover:bg-[#A60014] w-full"
          >
            <NavLink href="/exchange"> صرافی</NavLink>
          </li>

          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-4  hover:bg-[#A60014] w-full"
          >
            <NavLink href="/blog"> وبلاگ</NavLink>
          </li>
          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-4  hover:bg-[#A60014] w-full"
          >
            <NavLink href="/shop"> فروشگاه</NavLink>
          </li>

          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-1 my-2 hover:bg-[#A60014] w-full"
          >
            <NavLink href="/about-us">درباره ما</NavLink>
          </li>
          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-1 my-2 hover:bg-[#A60014] w-full "
          >
            <NavLink href="/contact-us">تماس با ما</NavLink>
          </li>

          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="py-4  hover:bg-[#A60014] w-full"
          >
            <NavLink href="/job-position"> موقعیت شغلی</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
