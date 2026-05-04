"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FirstChildDetails from "./first-child-details";
import EmploymentType from "./employmen-type/page";
import Pagination from "@/components/shared/pagination/page";
import errIcon from "@/public/images/shop/error-red.svg";

interface positionType {
  id: number;
  title: string;
  minSalary: string;
  maxSalary: string;
  Tags: { id: number; type: string }[];
  EmploymentType: { id: number; type: string };
  ArticleType: { id: number; type: string };
}

const FirstChild = () => {
  const [jobs, setJobs] = useState<positionType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };

  useEffect(() => {
    const _jobs = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/getJobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employmentType: selectedGroup,
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setJobs(_data?.data?.rows);
          setTotalItems(_data?.data?.count);
          break;

        default:
          break;
      }
    };

    _jobs();
  }, [
    selectedGroup,
    setJobs,
    setCurrentPage,
    setTotalItems,
    currentPage,
    itemsPerPage,
  ]);

  return (
    <div
      className="w-[70%] mx-auto mt-28
    screen1650:w-[80%]
    screen750:w-[90%]
     screen750:mt-16
    "
    >
      <div className="w-full mx-auto flex flex-row-reverse justify-between space-x-4 space-x-reverse">
        <div
          className="my-auto text-[#221D23] text-2xl font-semibold
          screen1440:text-xl
            screen750:text-lg
            screen450:text-[17px]
            screen400:text-base
        "
        >
          منتظر شما هستیم
        </div>
        <hr className="flex-grow mx-auto my-auto" />
        <EmploymentType setSelectedGroupProps={setSelectedGroup} />
      </div>

      {jobs?.length === 0 ? (
        <div className=" w-fit mx-auto  pt-10 pb-12  my-40 screen1000:my-8">
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
          screen705:gap-6
          "
        >
          {jobs?.map((item) => {
            return (
              <div key={item.id}>
                <FirstChildDetails item={item} />
              </div>
            );
          })}
        </div>
      )}

      <div style={{ direction: "rtl" }} className="my-20">
        {totalItems > 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default FirstChild;
