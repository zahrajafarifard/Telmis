"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import OtherPositionsDetails from "../first-child-details";

import Duties from "./duties";
import EmploymentType from "../employmen-type/page";
import errIcon from "@/public/images/shop/error-red.svg";

interface Props {
  duties: string;
  articleType: number;
  articleId: number;
}

interface positionType {
  id: number;
  title: string;
  minSalary: string;
  maxSalary: string;
  Tags: { id: number; type: string }[];
  EmploymentType: { id: number; type: string };
  ArticleType: { id: number; type: string };
}

const Main: FC<Props> = ({ duties, articleType, articleId }) => {
  const [selectedItem, setSeletedItem] = useState<number>(1);
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [relatedJobs, setRelatedJobs] = useState<positionType[]>([]);

  useEffect(() => {
    const _job = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/relatedJobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            articleId,
            articleTypeId: articleType,
            employmentType: selectedGroup,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setRelatedJobs(_data?.data);
          break;

        default:
          break;
      }
    };

    if (articleType) {
      _job();
    }
  }, [articleType, setRelatedJobs, selectedGroup]);

  return (
    <div
      className="w-[70%] mx-auto mt-28 screen1000:mt-28
        screen1250:w-[80%]
        screen750:w-[90%]
        screen750:mt-16 "
    >
      <div>
        <div
          style={{ direction: "rtl" }}
          className="flex flex-row space-x-14 space-x-reverse text-[24px] leading-[36px] mb-12
            screen1000:space-x-5
            screen1000:space-x-reverse"
        >
          <div
            onClick={() => setSeletedItem(1)}
            className={`cursor-pointer screen1000:text-lg screen400:text-base ${
              selectedItem === 1
                ? "text-[#221D23] border-b-4 border-[#A60014] rounded-[4px]"
                : "text-[#D9D9D9]"
            }`}
          >
            وظایف و مسئولیت‌ها
          </div>
        </div>

        {selectedItem === 1 && <Duties duties={duties} />}
      </div>

      <div className="w-full mx-auto my-48 screen1100:my-24">
        <div className="w-full mx-auto flex flex-row-reverse justify-between space-x-4 space-x-reverse">
          <div
            className="my-auto text-[#221D23] text-2xl font-semibold
              screen1440:text-xl
              screen750:text-lg
              screen450:text-[17px]
              screen400:text-base"
          >
            موقعیت شغلی های دیگر
          </div>
          <hr className="flex flex-grow mx-auto my-auto" />
          <EmploymentType setSelectedGroupProps={setSelectedGroup} />
        </div>
        {relatedJobs.length === 0 ? (
          <div className=" w-fit mx-auto  pt-10 pb-12 my-24 screen1000:my-8">
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
              هیچ موقعیت شغلی وجود ندارد .
            </div>
          </div>
        ) : (
          <div
            style={{ direction: "rtl" }}
            className="grid grid-cols-3 gap-x-7 gap-y-14 mt-20
              screen750:mt-9
              screen1270:gap-x-5
              screen1270:gap-y-10
              screen1050:grid-cols-2
              screen1050:gap-x-10
              screen950:gap-6     
              screen850:gap-4   
              screen705:grid-cols-1
              screen705:gap-6"
          >
            {relatedJobs?.map((item) => {
              return (
                <div key={item.id}>
                  <OtherPositionsDetails item={item} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
