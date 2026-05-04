"use client";
import React from "react";
import Image from "next/image";

interface CardItemProps {
  icon: string;
  title: string;
  address?: string;
  action?: {
    text: string;
    icon: string;
  };
  selected?: boolean;
  onClick?: () => void;
  setChooseAddressModal?: (val: boolean) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  icon,
  title,
  address,
  action,
  selected,
  onClick,
  setChooseAddressModal,
}) => {
  return (
    <div
      className={`flex flex-row-reverse justify-between border-[0.5px] screen400:px-3 ${
        selected ? "border-[#A60014]" : "border-[#D9D9D9]"
      } rounded-[8px] px-6 mb-5 cursor-pointer`}
      onClick={onClick}
    >
      <div
        className="flex flex-row-reverse space-x-reverse space-x-4
      screen400:space-x-2
      screen400:space-x-reverse
      "
      >
        <Image
          src={icon}
          width={31}
          height={31}
          alt=""
          className="my-auto screen750:w-6 screen750:h-6"
        />
        <div
          className={`text-right ${
            address ? "my-5 screen750:py-4 " : "my-auto"
          } `}
        >
          <p
            className={`my-auto  screen750:text-sm screen350:text-xs ${
              selected ? "text-[#221D23]" : "text-[#919191]"
            }`}
          >
            {title}
          </p>
          {address !== "" && (
            <p className="my-auto text-[#919191] text-sm pt-2 pl-4 screen750:hidden">
              {address}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div
          onClick={() => {
            setChooseAddressModal && setChooseAddressModal(true);
          }}
          className={`flex flex-row-reverse space-x-reverse space-x-2 border-[0.5px]  rounded-[4px] py-4 my-5 w-40  justify-center items-center

            screen1100:w-48
            screen750:w-40
            screen500:w-32
            screen450:w-24
            screen450:space-x-0.5
        ${selected ? "border-[#A60014]" : "border-[#919191]"}
      `}
        >
          <p
            className={`my-auto text-sm screen750:text-xs screen350:text-[10px]
          ${selected ? "text-[#221D23]" : "text-[#919191]"}
          `}
          >
            {action.text}
          </p>
          <Image
            src={action.icon}
            width={17}
            height={17}
            alt="ایکن"
            className={`my-auto
            ${selected ? "brightness-0" : ""}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default CardItem;
