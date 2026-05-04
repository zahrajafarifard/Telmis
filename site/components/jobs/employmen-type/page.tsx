"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface CategorieProps {
  setSelectedGroupProps: (value: number) => void;
}

interface EmpType {
  id: number;
  type: string;
}

const Categorie: React.FC<CategorieProps> = ({ setSelectedGroupProps }) => {
  const [employmentTypes, setEmploymentTypes] = useState<EmpType[]>([]);
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<number>(1);

  useEffect(() => {
    const _job = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/employmentTypes`
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          const all = {
            id: 0,
            type: "همه موارد",
          };
          setEmploymentTypes(_data?.data);
          setEmploymentTypes((prev) => [...prev, all]);
          break;

        default:
          break;
      }
    };

    _job();
  }, [setEmploymentTypes]);
  

  return (
    <div>
      <div className="relative">
        <div
          onClick={() => {
            setShowGroup((prev) => !prev);
          }}
          className="bg-[#F2F2F2] rounded-[50px]  flex flex-row-reverse px-10 py-2 screen750:px-2"
        >
          <Image
            src="/images/group.svg"
            width={24}
            height={24}
            alt="group"
            className="ml-2 screen750:ml-0 screen750:w-4 screen750:h-4"
          />
          <span
            className="text-[#979797] my-auto text-[20px] screen1440:text-lg
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
              className="w-screen h-screen fixed top-0 left-0 "
            />
            <div
              className="flex flex-col bg-white shadow-[0px_4px_15px_2px_rgba(0,0,0,0.09)] absolute top-14 left-0 rounded-[10px] pr-12 py-5 w-56 leading-[31px] 
              screen750:top-10
              screen750:w-44
              screen750:pr-4
              screen750:py-4
              screen750:text-sm "
            >
              {employmentTypes?.length === 1 ? (
                <small style={{ direction:'rtl'}} className="text-right text-[#999]">
                  موقیت شغلی وجود ندارد .
                </small>
              ) : (
                employmentTypes?.map((item) => {
                  return (
                    <div
                      key={item?.id}
                      onClick={() => {
                        setSelectedGroup(item?.id);
                        setSelectedGroupProps(item?.id);

                        setShowGroup(false);
                      }}
                      className="flex flex-row-reverse mb-2 cursor-pointer"
                    >
                      <Image
                        src="/images/Target_light.svg"
                        width={26}
                        height={26}
                        alt="az"
                        className={`${
                          selectedGroup !== item?.id && "grayscale opacity-45"
                        }`}
                      />
                      <span
                        className={`mr-2 ${
                          selectedGroup !== item?.id
                            ? "text-[#919191]"
                            : "text-black"
                        }`}
                      >
                        {item?.type}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categorie;
