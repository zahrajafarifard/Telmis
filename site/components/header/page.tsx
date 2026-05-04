"use client";
import Image from "next/image";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";

import { clearResponse } from "@/store/slices/cart";

import NavLink from "../shared/navLink";
import styles from "../shared/style.module.css";
import Sidebar from "./sideBar";
import Search from "../shop/search/page";
import cartWhite from "@/public/images/cart-white.svg";
import cart from "@/public/images/cart.svg";
import userWhite from "@/public/images/user-white.svg";
import user from "@/public/images/user.svg";
import logoWhite from "@/public/images/Telmis-Logo-white.png";
import logoRed from "@/public/images/Telmis-Logo-Red.png";

import exchangePannel from "@/public/images/exchange-pannel-red.svg";

import AutorizedUser from "./autorized-user";
import AuthModal from "../shop/login/auth";
import OTPModal from "../shop/login/OTP";

const Menu = () => {
  const _token = useSelector((state: RootState) => state.token.token);

  const dispatch = useDispatch();
  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<{ mobile: string; name: string; password: string }>({
    mode: "all",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearResponse());
  };


  const [showServices, setShowServices] = useState<boolean | string>(false);

  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState<number>(0);
  const handleMouseEnter = (value: number) => setIsHovered(value);
  const handleMouseLeave = (value: number) => setIsHovered(value);

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

  return (
    <div
      className={`${
        lastScrollY > 0 &&
        window.innerWidth < 1000 &&
        "sticky top-0 z-50 bg-gradient-to-r  w-full h-24 from-[#A60014] to-[#600B0E]"
      }`}
    >
      <div
        style={{ direction: "rtl" }}
        className={`flex flex-row mx-auto py-6 my-auto inset-x-0  

        

      ${
        pathname.includes("/shop")
          ? "w-[94%] screen1000:w-[80%] screen790:w-[90%]"
          : "w-[85%] screen1300:w-[90%] screen1050:w-[94%] screen1000:w-[80%] screen790:w-[90%]"
      }
      ${pathname === "/" && "absolute top-0 z-10 "}     
      `}
      >
        <div
          className={`flex flex-row mx-auto justify-between screen1000:hidden 
          ${
            pathname.includes("/shop")
              ? "w-[54%] "
              : "w-[74%] screen1250:w-[70%] screen1200:w-[68%]  "
          }
          `}
        >
          <Link href="/" className="cursor-pointer my-auto">
            <Image
              alt="لوگوی شرکت داده پردازان تلمیس"
              src={`${pathname === "/" ? logoWhite.src : logoRed.src}`}
              className=" mx-auto my-auto"
              width={105}
              height={45}
            />
          </Link>
          <ul className="flex flex-row w-[80%]  mx-auto justify-between text-xl">
            <li
              onClick={() => {
                setShowServices(false);
              }}
              className="my-auto"
            >
              <NavLink href="/">خانه</NavLink>
            </li>

            <li
              onClick={() => {
                setShowServices((prev) => !prev);
              }}
              className="my-auto relative"
            >
              <span
                className={`flex flex-row my-auto  cursor-pointer caret-transparent text-xl screen1250:text-base 
                ${
                  pathname.includes("/services/")
                    ? "text-[#A60014]"
                    : pathname === "/"
                    ? "text-white"
                    : "text-[#221D23]"
                }

                ${
                  pathname !== "/"
                    ? "hover:text-[#A60014]"
                    : "hover:text-[#FFDA8A]"
                }
                `}
              >
                خدمات
                <span className="my-auto">
                  <Image
                    src={
                      pathname.includes("/services/")
                        ? "/images/arrow-red.svg"
                        : "/images/arrow_down.svg"
                    }
                    className={` mr-2 ${
                      pathname !== "/" &&
                      !pathname.includes("/services") &&
                      "filter grayscale brightness-0"
                    }
                  
                 ${showServices && "transform scale-y-[-1]"} `}
                    alt="فلش پایین"
                    width={10}
                    height={10}
                  />
                </span>
              </span>

              {showServices && (
                <>
                  <div
                    className="fixed w-full h-full top-0 left-0  z-40 "
                    onClick={() => {
                      setShowServices("false");
                    }}
                  />

                  <div
                    className={`grid absolute bg-white   w-52 top-10  font-light  text-right z-50 rounded-[4px] py-5 px-6
                ${
                  pathname !== "/" &&
                  "shadow-[1px_1px_10px_1px_rgba(0,0,0,0.13)]"
                }
            
              `}
                  >
                    <Link href="/services/network">
                      <span
                        onMouseEnter={() => handleMouseEnter(1)}
                        onMouseLeave={() => handleMouseLeave(0)}
                        className={`${
                          isHovered === 1 ? styles.textColor : "text-black"
                        }`}
                      >
                        خدمات شبکه
                      </span>
                    </Link>

                    <Link href="/services/web-app" className="py-5">
                      <span
                        onMouseEnter={() => handleMouseEnter(2)}
                        onMouseLeave={() => handleMouseLeave(0)}
                        className={`${
                          isHovered === 2 ? styles.textColor : "text-black"
                        }`}
                      >
                        طراحی وب و اپ
                      </span>
                    </Link>
                    <Link href="/services/camera">
                      <span
                        onMouseEnter={() => handleMouseEnter(3)}
                        onMouseLeave={() => handleMouseLeave(0)}
                        className={`${
                          isHovered === 3 ? styles.textColor : "text-black"
                        }`}
                      >
                        دوربین مدار بسته
                      </span>
                    </Link>
                  </div>
                </>
              )}
            </li>

            <li
              onClick={() => {
                setShowServices(false);
              }}
              className="my-auto"
            >
              <NavLink href="/exchange"> صرافی</NavLink>
            </li>

            <li
              onClick={() => {
                setShowServices(false);
              }}
              className="my-auto"
            >
              <NavLink href="/blog"> وبلاگ</NavLink>
            </li>
            <li
              onClick={() => {
                setShowServices(false);
              }}
              className="my-auto"
            >
              <NavLink href="/shop"> فروشگاه</NavLink>
            </li>
            <li
              onClick={() => {
                setShowServices(false);
              }}
              className="my-auto"
            >
              <NavLink href="/about-us">درباره ما</NavLink>
            </li>

            <li
              onClick={() => {
                setShowServices(false);
              }}
              className="my-auto"
            >
              <NavLink href="/contact-us">تماس با ما</NavLink>
            </li>
            {/* <li
              onClick={() => {
                setShowServices(false);
              }}
              className="mr-2  my-auto"
            >
              <NavLink href="/job-position"> موقعیت شغلی</NavLink>
            </li> */}
          </ul>
        </div>

        <div
          className={` mx-auto screen1000:ml-0
          ${
            pathname.includes("/shop")
              ? "w-[35%] screen1650:w-[38%] screen1460:w-[40%] screen1250:w-[45%] screen1000:w-fit  screen1000:space-x-3 screen1000:space-x-reverse"
              : `w-[26%]   screen1680:w-[29%]  screen1000:w-fit
              screen1560:w-[30%] 
              screen1540:w-[26%] screen1460:w-[29%] 
              screen1360:w-[28%] screen1200:w-[30%] screen1150:w-[32%]   `
          }
        `}
        >
          <div
            className={`flex flex-row  w-full
            ${
              pathname.includes("/shop")
                ? "space-x-3 space-x-reverse screen1360:space-x-2 screen1360:space-x-reverse  screen1000:justify-between screen500:space-x-1 screen500:space-x-reverse"
                : "justify-between  screen1000:space-x-3 screen1000:space-x-reverse"
            }`}
          >
            {pathname.includes("/shop") && <Search />}
            <Link href={"/shop/cart"} className="my-auto">
              <div
                className={`relative overflow-hidden group my-auto rounded-full w-[48px] h-[48px] flex justify-center items-center 
                  ${
                    pathname.includes("/shop")
                      ? "  screen1360:w-[44px] screen1360:h-[44px]  "
                      : `screen1000:w-[50px] screen1000:h-[50px]`
                  }
                
                  ${
                    pathname === "/"
                      ? "bg-[#fff]"
                      : window.innerWidth < 1000 && lastScrollY > 0
                      ? "bg-[#fff]"
                      : "bg-[#A60014]"
                  }
                `}
              >
                <span
                  className={`absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 
                  rounded-full group-hover:opacity-100 group-hover:scale-150
                    ${
                      pathname === "/"
                        ? "bg-[#FFDA8A]"
                        : "bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E] screen1000:bg-none"
                    }
                  `}
                ></span>
                <Image
                  src={
                    pathname !== "/"
                      ? window.innerWidth < 1000 && lastScrollY > 0
                        ? cart
                        : cartWhite
                      : cart
                  }
                  className={`my-auto mx-auto relative z-10 screen1360:w-9 screen1360:h-9        
              `}
                  alt="سبد خرید "
                  width={40}
                  height={40}
                />
              </div>
            </Link>

            {_token ? (
              <AutorizedUser />
            ) : (
              <div
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className={`  flex flex-row my-auto rounded-[50px]  relative overflow-hidden
                   group  w-[48px] h-[48px] justify-center items-center 

                ${
                  pathname.includes("/shop")
                    ? "screen1360:w-[44px] screen1360:h-[44px] w-[48px] h-[48px] px-0 py-0 flex justify-center items-center "
                    : "screen690:p-3 py-2.5 px-8 "
                }
                ${
                  pathname === "/"
                    ? "bg-[#fff]"
                    : window.innerWidth < 1000 && lastScrollY > 0
                    ? "bg-[#fff]"
                    : "bg-[#A60014]"
                }
              `}
              >
                <span
                  className={`absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 rounded-full group-hover:opacity-100 group-hover:scale-150
                ${
                  pathname === "/"
                    ? "bg-[#FFDA8A]"
                    : "bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E] screen1000:bg-none"
                }`}
                ></span>

                <Image
                  src={
                    pathname === "/"
                      ? user
                      : window.innerWidth < 1000 && lastScrollY > 0
                      ? user
                      : userWhite
                  }
                  className={`my-auto relative z-10 
                  ${
                    pathname.includes("/shop")
                      ? "ml-[0px] flex justify-center items-start "
                      : "ml-[5px]  screen690:ml-0 "
                  }
                  `}
                  alt="کاربر"
                  width={32}
                  height={32}
                />

                <span
                  className={`my-auto relative z-10 font-normal whitespace-nowrap screen1360:text-sm
              ${
                pathname === "/"
                  ? styles.textColor
                  : window.innerWidth < 1000 && lastScrollY > 0
                  ? styles.textColor
                  : "text-white "
              }
              ${pathname.includes("/shop") ? "hidden " : "screen690:hidden "}
             
              `}
                >
                  پنل کاربری
                </span>
              </div>
            )}

            <Link href="https://exchange.telmis.ir">
              <div
                className={` flex flex-row my-auto justify-center items-center rounded-[50px] py-2.5 w-28 relative overflow-hidden group screen1540:px-5
              ${
                pathname.includes("/shop")
                  ? " screen1150:w-fit screen1150:px-2 screen1360:p-2  "
                  : "screen690:p-3  "
              }
              ${
                pathname === "/"
                  ? "bg-[#fff]"
                  : window.innerWidth < 1000 && lastScrollY > 0
                  ? "bg-[#fff]"
                  : "border-[2px] border-[#A60014]"
              }
              `}
              >
                <span
                  className={`absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 rounded-full group-hover:opacity-100 group-hover:scale-150
              ${
                pathname === "/"
                  ? "bg-[#FFDA8A]"
                  : "bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E] screen1000:bg-none"
              }
            `}
                ></span>
                <Image
                  src={
                    pathname === "/"
                      ? exchangePannel
                      : window.innerWidth < 1000 && lastScrollY > 0
                      ? exchangePannel
                      : exchangePannel
                  }
                  className={`my-auto ml-[5px] relative z-10
                ${
                  pathname.includes("/shop")
                    ? "screen1150:ml-0"
                    : "screen690:ml-0  "
                }
                  `}
                  alt="کاربر"
                  width={25}
                  height={25}
                />
                <span
                  className={`my-auto relative z-10 font-normal  whitespace-nowrap screen1360:text-sm
                ${
                  pathname.includes("/shop")
                    ? "screen1150:hidden "
                    : "screen690:hidden"
                }
              ${
                pathname === "/"
                  ? styles.textColor
                  : window.innerWidth < 1000 && lastScrollY > 0
                  ? styles.textColor
                  : "text-[#A60014] "
              }
             
              `}
                >
                  پنل صرافی
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="hidden screen1000:flex">
          <Sidebar />
        </div>
      </div>

      {isModalOpen && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={closeModal}
          register={register}
          isDirty={isDirty}
          isValid={isValid}
          getValues={getValues}
          setIsOTPModalOpen={setIsOTPModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isOTPModalOpen && (
        <OTPModal
          isOpen={isOTPModalOpen}
          onClose={() => setIsOTPModalOpen(false)}
          register={register}
          isDirty={isDirty}
          isValid={isValid}
          getValues={getValues}
        />
      )}
    </div>
  );
};

export default Menu;
