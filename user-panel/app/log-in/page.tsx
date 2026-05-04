"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import Modal from "@/components/shared/modal/page";
import { useNavigateMobile } from "@/components/shared/page";
import LogInImg from "@/public/images/login.png";
import Logo from "@/public/images/Telmis-Logo-Red.png";
import ErrorIcon from "@/public/images/error.svg";
import CheckIcon from "@/public/images/Check_ring.svg";
import Border from "@/public/images/login-border.png";
import "@/components/shared/style.css";

const Login = () => {
  const router = useRouter();
  const [responseStatus, setResponseStatus] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    getValues,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<{ mobile: string }>({
    mode: "all",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    const timer = setTimeout(() => {
      // responseStatus !== 200 &&
      //   responseStatus !== 403 &&
      //   responseStatus !== 0 &&
      //   setResponseStatus(0);

      if (
        responseStatus !== 200 &&
        responseStatus !== 403 &&
        responseStatus !== 0
      ) {
        setResponseStatus(0);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [responseStatus]);

  const setDetails = useNavigateMobile((state) => state.setDetails);

  const generatePasswordHandler = async () => {
    setResponseStatus(0);
    let data: {
      capcha: { data: Buffer };
      mobile: string;
      authenticatedByAdmin: boolean;
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/checkMobile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: getValues("mobile"),
          }),
        }
      );

      switch (response.status) {
        case 200:
          data = await response.json();
          console.log('ddd' , data);
          
          // console.log("log in data", data, typeof data?.capcha);
          setResponseStatus(200);
          const base64String = btoa(String.fromCharCode(...data?.capcha?.data)); //convert decimal to hex

          setDetails(data.mobile, base64String);
          setTimeout(() => {
            // redirectTo
            //   ? router.push(`/check-password?redirectTo=${redirectTo}`)
            //   : router.push(`/check-password`);

            if (redirectTo) {
              router.push(`/check-password?redirectTo=${redirectTo}`);
            } else {
              router.push(`/check-password`);
            }
          }, 4000);
          break;

        case 403:
          openModal();
          setResponseStatus(403);
          break;

        case 404:
          setResponseStatus(404);

          // setTimeout(() => {
          //   router.push(`/register`);
          // }, 3000);
          break;

        case 500:
          setResponseStatus(500);
          break;

        default:
          setResponseStatus(500);
          break;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        event.preventDefault();
        generatePasswordHandler();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [generatePasswordHandler]);

  return (
    <div>
      {responseStatus === 404 && (
        <div className="fixed top-10 right-0 rounded-s-[8px] bg-[#FFF099] flex flex-row-reverse w-fit pl-14 pr-16">
          <Image src={ErrorIcon} width={20} height={20} alt="آیکن هشدار" />
          <div className=" text-[#D76B00]  py-4 mr-2">
            این شماره تماس وجود ندارد، لطفا ثبت نام کنید
          </div>
        </div>
      )}
      {responseStatus === 403 && (
        <Modal
          isOpen={isModalOpen}
          // onClose={closeModal}
        >
          <div className="text-white text-center text-2xl screen850:text-lg screen620:text-base ">
            ثبت نام
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-white text-center  my-6 text-xl px-4 screen850:text-base screen620:text-sm "
          >
            حساب کاربری شما پس از احراز هویت ایجاد می شود. به محض ایجاد حساب
            کاربری از طریق پیامک به شما اطلاع داده می شود.
          </div>
          <div
            onClick={() => {
              closeModal();
            }}
            className="bg-[#FFDA8A] w-fit px-3 py-1 mx-auto mt-10 rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
          >
            بازگشت به صفحه ورود
          </div>
        </Modal>
      )}
      {responseStatus === 200 && (
        <div className="fixed top-10 right-0 rounded-s-[8px] bg-[#CBEDCB] flex flex-row-reverse w-fit pl-14 pr-16">
          <Image
            src={CheckIcon}
            width={20}
            height={20}
            alt="ایکن عملیات موفق"
          />
          <div className=" text-[#219235]  py-4 mr-2">
            کد یکبار مصرف با موفقیت ارسال شد
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between ">
        <div className="w-1/2 relative h-screen">
          <Image
            src={LogInImg}
            className="w-full h-full object-cover"
            quality={40}
            priority={true}
            fill
            alt="عکس صفحه ورود به پرتال مشتریان تلمیس"
            sizes="50vw"
          />
        </div>
        <div style={{ direction: "rtl" }} className="w-1/2 my-auto">
          <div className="w-[70%] mx-auto">
            <Image
              src={Logo}
              className="w-30 mb-5"
              width={150}
              height={10}
              alt="لوگو شرکت داده پردازان تلمیس"
            />
            <h1 className="text-right text-[#221D23] font-bold text-[38px]  leading-[58px] mb-2">
              به پنل خود وارد شوید
            </h1>

            <h4 className="text-right text-[#8F8F8F] leading-[31px] ">
              به گروه ما خوش آمدید!
            </h4>

            <Image
              src={Border}
              className="w-full my-5"
              width={1000}
              height={10}
              alt="حاشیه"
            />

            <div className="mb-6">
              <p className="text-right text-[#221D23] leading-[31px] mb-2">
                شماره تماس
                <span className="text-[#A60014]">*</span>
              </p>
              <input
                placeholder="شماره تماس خود را وارد کنید"
                className={`w-full p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none ${
                  (responseStatus === 404 || errors.mobile) &&
                  "border border-[#B3323A]"
                }`}
                {...register("mobile", {
                  required: "شماره تماس اجباری است",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "شماره تماس معتبر نیست",
                  },
                })}
              />
              {errors.mobile && (
                <p className="text-[#B3323A] text-xs text-right mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* {responseStatus === 404 && (
              <p className="text-[#7A7A7A] flex flex-row justify-end -mb-8 -mt-3">
                این شماره تماس وجود ندارد لطفا
                <Link href={"/register"}>
                  <span className="underline text-[#A60014] font-[500] px-[4px] ">
                    ثبت نام
                  </span>
                </Link>
                کلیک کنید.
              </p>
            )} */}

            <div className="mt-16 mb-5">
              <button
                disabled={!isValid || !isDirty || isSubmitting}
                onClick={generatePasswordHandler}
                className="button w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg disabled:cursor-not-allowed"
              >
                <span className="button-hover-effect"></span>
                <p className="button-hover-effect-text ">ارسال کد یکبار مصرف</p>
              </button>
            </div>

            <p className="leading-[31px] text-center">
              <span className="text-[#221D23]">حساب کاربری ندارید؟ </span>
              <Link href={"/register"}>
                <span className="text-[#A60014] underline cursor-pointer">
                  یک حساب کاربری ایجاد کنید
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
