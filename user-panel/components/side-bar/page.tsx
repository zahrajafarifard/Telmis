"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import SidebarLink from "./sidebar-link";
import Modal from "@/components/shared/modal/page";
import { logOut } from "../../store/slices/client";

const SideBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className=" h-full min-h-screen relative ">
      <div className=" w-full mx-auto py-24">
        <Image
          src="/images/Telmis-Logo-Red.png"
          alt=""
          width={135}
          height={60}
          className="mx-auto"
        />
      </div>

      <SidebarLink
        href="/client/overall-view"
        iconSrc="/images/sidebar-overall.svg"
        hoverIconSrc="/images/sidebar-hover-overall.svg"
        label="نگاه کلی"
      />

      <SidebarLink
        href="/client/resume"
        iconSrc="/images/sidebar-order.svg"
        hoverIconSrc="/images/sidebar-hover-order.svg"
        label="آپلود رزومه"
      />
      <SidebarLink
        href="/client/orders"
        iconSrc="/images/sidebar-order.svg"
        hoverIconSrc="/images/sidebar-hover-order.svg"
        label="سفارشات"
      />

      <SidebarLink
        href="/client/favorites"
        iconSrc="/images/sidebar-fav.svg"
        hoverIconSrc="/images/sidebar-hover-fav.svg"
        label="لایک شده ها"
      />
      <SidebarLink
        href="/client/notification"
        iconSrc="/images/header-notif.svg"
        hoverIconSrc="/images/sidebar-hover-notif.svg"
        label="اعلانات"
      />

      <Link href="https://telmis.ir">
        <div className="flex flex-row-reverse pr-10 py-2  mb-5">
          <Image src="/images/sidebar-back.svg" width={24} height={24} alt="" />
          <span className="text-[#A60014] text-lg leading-[31px] mr-5">
            بازگشت به خانه
          </span>
        </div>
      </Link>

      <div
        onClick={() => {
          openModal();
        }}
        className="flex flex-row-reverse pr-10 py-2  mb-5"
      >
        <Image src="/images/sidebar-logout.svg" width={24} height={24} alt="" />
        <span className="text-[#A60014] text-lg leading-[31px] mr-5">
          خروج از حساب
        </span>
      </div>

      <div className="absolute bottom-10 inset-x-0 mx-auto w-full flex justify-center">
        <Image
          src={"/images/side-bar.png"}
          width={249}
          height={215}
          alt=""
          className=""
        />
      </div>

      {isModalOpen && (
        <>
          <div
            className="w-full h-full bg-gray-50 fixed top-0 left-0 opacity-70 z-10"
            onClick={closeModal}
          />

          <Modal
            isOpen={isModalOpen}
            // onClose={closeModal}
          >
            <div
              style={{ direction: "rtl" }}
              className="text-white text-center  my-6 text-xl px-4 screen850:text-base screen620:text-sm "
            >
              آیا مطمئن هستید که می‌خواهید خارج شوید؟
            </div>
            <div className="flex flex-row-reverse mt-10  justify-between w-full mx-auto ">
              <div
                onClick={() => {
                  dispatch(logOut());
                  router.replace("/");
                }}
                className="bg-[#FFDA8A] w-[40%] px-3 py-1 mx-auto text-center rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
              >
                خروج
              </div>
              <div
                onClick={() => {
                  closeModal();
                }}
                className="bg-[#FFF] text-[#919191] w-[40%] px-3 py-1 mx-auto text-center rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
              >
                لغو
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default SideBar;
