
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/components/shared/modal/page";
import warningIcon from "@/public/images/shop/error.svg";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/slices/token";
import { clearResponse } from "@/store/slices/cart";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  register: any;
  isDirty: boolean;
  isValid: boolean;
  getValues: any;
};

export default function OTPModal({
  isOpen,
  onClose,
  register,
  isDirty,
  isValid,
  getValues,
}: Props) {
  const dispatch = useDispatch();


  const [secondsLeft, setSecondsLeft] = useState(120);
  const [showToast, setShowToast] = useState(false);

  const formatTime = () => {
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: getValues("mobile") }),
      });

      if (response.ok) {
        setSecondsLeft(120);
      } else {
        console.error("Resend OTP failed.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  const handleVerify = async () => {
    if (!isDirty || !isValid) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: getValues("mobile"),
          password: getValues("password"),
        }),
      });

      switch (response.status) {
        case 200:
          const data = await response.json();
          dispatch(setToken(data.token));
          onClose();
          break;
        case 400:
          alert("کد را وارد کنید");
          break;
        case 401:
          setShowToast(true);
          break;
        case 404:
          alert("کاربری با این شماره وجود ندارد");
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showToast) {
      const toastTimer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(toastTimer);
    }
  }, [showToast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {showToast && (
        <div className="bg-[#FFF099] text-[#D76B00] flex items-center gap-2 py-2 px-6 rounded absolute top-3 right-3 z-50">
          رمز وارد شده اشتباه است.
          <Image src={warningIcon} width={26} height={26} alt="warning icon" />
        </div>
      )}
      <div className="w-[80%] mx-auto py-5">
        <div className="text-[32px] text-white text-center font-semibold pb-4">ورود یا ثبت نام</div>
        <div className="text-[24px] text-white text-center mb-10">
          کد ۶ رقمی ارسال شده به موبایلتان را در این کادر وارد کنید
        </div>

        <div className="text-right text-white leading-8 mb-2">رمز یک‌بار مصرف</div>
        <input
          className="rounded-[8px] bg-[#f7f7f7] p-4 text-[#919191] text-right w-full mb-2 outline-none"
          placeholder="رمز یک‌بار مصرف را وارد کنید"
          inputMode="numeric"
          onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))}
          {...register("password", {
            required: true,
            pattern: { value: /^[0-9]+$/, message: "فقط ارقام مجاز هستند" },
          })}
        />

        <div className="flex mr-auto mb-16 text-white">
          {secondsLeft > 0 && <span className="ml-1">({formatTime()})</span>}
          <button
            className="underline"
            onClick={handleResend}
            disabled={secondsLeft > 0}
            style={{ cursor: secondsLeft > 0 ? "not-allowed" : "pointer" }}
          >
            ارسال مجدد کد
          </button>
        </div>

        <div className="flex flex-row space-x-6">
          <div
            onClick={() => {
              onClose();
              dispatch(clearResponse());
            }}
            className="bg-[#fff] w-1/2 py-3 text-center rounded-[50px] text-lg cursor-pointer"
          >
            لغو
          </div>

          <div
            onClick={handleVerify}
            className={`bg-[#FFDA8A] w-1/2 py-3 text-center rounded-[50px] text-lg ${
              !isDirty || !isValid ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            ورود
          </div>
        </div>
      </div>
    </Modal>
  );
}
