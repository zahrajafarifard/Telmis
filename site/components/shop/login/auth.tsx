"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "@/components/shared/modal/page";
import { clearResponse } from "@/store/slices/cart";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  register: any;
  isDirty: boolean;
  isValid: boolean;
  getValues: any;
  setIsOTPModalOpen: (val: boolean) => void;
  setIsModalOpen: (val: boolean) => void;
};

export default function AuthModal({
  isOpen,
  onClose,
  register,
  isDirty,
  isValid,
  getValues,
  setIsOTPModalOpen,
  setIsModalOpen,
}: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignInOrUp = async () => {
    if (!isDirty || !isValid) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/signInUp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: getValues("name"),
            mobile: getValues("mobile"),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("ddddddd", data);
        setIsOTPModalOpen(true);
        setIsModalOpen(false);
      } else {
        alert(data.message || "خطایی رخ داده است");
      }
    } catch (error) {
      console.error("Sign-in/up failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[80%] mx-auto">
        <div className="text-[32px] text-white text-center font-semibold pb-4">
          ورود یا ثبت نام
        </div>
        <div className="text-[24px] text-white text-center mb-10">
          برای ادامه خرید وارد حساب کاربری خود شوید
        </div>

        <div className="text-right text-white leading-8 mb-2">
          نام و نام خانوادگی
        </div>
        <input
          className="rounded-[8px] bg-[#f7f7f7] p-4 text-[#919191] text-right w-full mb-4 outline-none"
          placeholder="نام خود را وارد کنید"
          {...register("name", { required: true })}
        />

        <div className="text-right text-white leading-8 mb-2">شماره تماس</div>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          className="rounded-[8px] bg-[#f7f7f7] p-4 text-[#919191] text-right w-full mb-16 outline-none"
          placeholder="شماره تماس خود را وارد کنید"
          onInput={(e) =>
            (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
          }
          {...register("mobile", {
            required: "شماره تماس اجباری است",
            pattern: { value: /^[0-9]{11}$/, message: "شماره تماس معتبر نیست" },
          })}
        />

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
            onClick={handleSignInOrUp}
            className={`bg-[#FFDA8A] w-1/2 py-3 text-center rounded-[50px] text-lg ${
              !isDirty || !isValid || loading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            تایید
          </div>
        </div>
      </div>
    </Modal>
  );
}
