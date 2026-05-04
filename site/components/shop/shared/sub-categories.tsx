"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  categoryId: number;
  setSelectedSubCategory: (val: number) => void;
  selectedSubCategory: number;
}
interface ArticleType {
  id: number;
  name: string;
}
const SubCategories: React.FC<Props> = ({
  categoryId,
  selectedSubCategory,
  setSelectedSubCategory,
}) => {
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<ArticleType[]>([]);

  useEffect(() => {
    const _subCats = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/subCategory`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();

          setSubCategories(_data?.subCategories);
          break;

        default:
          break;
      }
    };

    _subCats();
  }, [setSubCategories, categoryId]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          setShowGroup((prev) => !prev);
        }}
        className="bg-[#F2F2F2] rounded-[50px]  flex flex-row-reverse px-10 py-2 screen950:px-6
          screen750:px-2 "
      >
        <Image
          src="/images/group.svg"
          width={24}
          height={24}
          alt="دسته بندی"
          className="ml-2 screen750:ml-0 screen750:w-4 screen750:h-4"
        />
        <span
          className="text-[#979797] my-auto text-[20px] whitespace-nowrap
          screen1440:text-lg
          screen950:text-base
          screen750:hidden"
        >
          دسته بندی ها
        </span>
      </div>
      {showGroup && (
        <>
          <div
            onClick={() => {
              setShowGroup(false);
            }}
            className="w-screen h-screen fixed top-0 left-0  "
          />
          <div className="flex flex-col bg-white shadow-[0px_4px_15px_2px_rgba(0,0,0,0.09)] absolute top-14 left-0 z-40 rounded-[10px] pr-12 py-5 w-56 leading-[31px] ">
            {subCategories?.length === 0 ? (
              <div
                style={{ direction: "rtl" }}
                className="text-[#919191] text-right "
              >
                زیر دسته ندارد !
              </div>
            ) : (
              subCategories?.map((item) => {
                return (
                  <div
                    key={item?.id}
                    onClick={() => {
                      setSelectedSubCategory(item?.id);
                      setShowGroup(false);
                    }}
                    className="flex flex-row-reverse mb-2 cursor-pointer"
                  >
                    <Image
                      src="/images/Target_light.svg"
                      width={26}
                      height={26}
                      alt="icon"
                      className={`${
                        selectedSubCategory !== item?.id &&
                        "grayscale opacity-45"
                      }`}
                    />
                    <span
                      className={`mr-2 ${
                        selectedSubCategory !== item?.id
                          ? "text-[#919191]"
                          : "text-black"
                      }`}
                    >
                      {item?.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubCategories;
