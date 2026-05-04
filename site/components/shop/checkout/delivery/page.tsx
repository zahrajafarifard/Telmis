"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import moment from "moment-jalaali";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import timeIcon from "@/public/images/shop/Time.svg";
import errIcon from "@/public/images/shop/error-red.svg";

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface Day {
  id: number;
  date: string;
  shippingCost: number;
  slotDuration: number;
  TimeSlots: TimeSlot[];
}
interface PropsType {
  selectedSlot: number | null;
  setSelectedSlot: any;
  setShippingCost: (val: number) => void;
}

const Delivery: React.FC<PropsType> = ({
  selectedSlot,
  setSelectedSlot,
  setShippingCost,
}) => {
  moment.loadPersian({ usePersianDigits: true });
  const _token = useSelector((state: RootState) => state.token.token);

  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [Day, setDay] = useState<Day | null>(null);

  useEffect(() => {
    const _days = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery/getDaysOfyear`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();

          setDays(_data?.data);
          setSelectedDay(_data?.data[0]?.id);
          setShippingCost(_data?.data[0]?.shippingCost);
          setDay(_data.data[0]);
          break;

        default:
          break;
      }
    };

    if (_token) {
      _days();
    }
  }, [_token, setDays, setSelectedDay, setDay]);

  return (
    <div className="w-[80%] mx-auto screen1250:w-[90%] ">
      <div className="flex flex-row-reverse space-x-4 space-x-reverse my-6">
        <Image src={timeIcon} width={29} height={29} alt="timeIcon" />
        <label>زمان ارسال</label>
      </div>
      {days?.length === 0 ? (
        <div className=" w-fit mx-auto my-20 screen1000:my-8">
          <div className="w-fit mx-auto mb-4">
            <Image
              width={6}
              height={6}
              alt=""
              src={errIcon}
              className="w-24 h-24 screen1000:w-20 screen1000:h-20"
            />
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
          >
            بازهٔ زمانی تحویل سفارش مشخص نشده است.
          </div>
        </div>
      ) : (
        <div
          style={{ direction: "rtl" }}
          className="flex flex-wrap w-full  gap-2 screen550:justify-center"
        >
          {days?.map((day: Day) => {
            return (
              <div key={day.id} className="">
                <div
                  onClick={() => {
                    setDay(day);
                    setShippingCost(day?.shippingCost);
                    setSelectedDay(day?.id);
                    setSelectedSlot(null);
                  }}
                  className={`flex flex-col border border-[#D9D9D9] text-[#221D23] rounded-[6px] w-28 items-center p-2 
                ${selectedDay === day?.id && "bg-[#D9D9D9]"}
                `}
                >
                  <div className="text-sm py-1 screen950:text-xs">
                    {moment(day?.date, "YYYY-MM-DD HH:mm:ss").format("dddd")}
                  </div>
                  <div
                    style={{ direction: "rtl" }}
                    className="text-sm pb-2 screen950:text-xs"
                  >
                    {moment(day?.date, "YYYY-MM-DD HH:mm:ss").format(
                      "jD jMMMM"
                    )}
                  </div>
                  <p
                    style={{ direction: "rtl" }}
                    className="text-[9px] pb-1 rounded-[4px] bg-white w-fit mx-auto px-4 py-1.5 screen750:px-2"
                  >
                    {Number(day?.shippingCost).toLocaleString()} تومان
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="my-10 ">
        {Day?.TimeSlots?.map((slot: TimeSlot) => {
          const startTime = moment(slot.startTime);
          const endTime = startTime.clone().add(Day?.slotDuration, "minutes");

          return (
            selectedDay === Day?.id && (
              <div
                key={slot.id}
                className="flex flex-row-reverse space-x-2 space-x-reverse text-[#221D23] my-4"
              >
                <input
                  type="radio"
                  name="timeSlot"
                  width={20}
                  height={20}
                  value={slot.id}
                  checked={selectedSlot === slot.id}
                  onChange={() => {
                    setSelectedSlot(slot.id);
                  }}
                  className=" accent-[#A60014] "
                />
                <span>
                  {startTime.format("HH:mm")}
                  <span className="mx-2">ساعت</span>
                </span>
                <span>
                  {endTime.format("HH:mm")}
                  <span className="mx-2">تا</span>
                </span>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Delivery;
