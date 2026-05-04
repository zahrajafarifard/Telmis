import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface ItemProps {
  item: {
    id: number;
    title: string;
    minSalary: string;
    maxSalary: string;

    Tags: { id: number; type: string }[];
    EmploymentType: { id: number; type: string };
    ArticleType: { id: number; type: string };
  };
}

const FirstChildDetails: FC<ItemProps> = ({ item }) => {
  return (
    <div
      className="bg-[#F7F7F7] rounded-[8px] px-9 py-11
    screen1560:px-6
    screen1560:py-7
    screen1050:py-10
    screen890:pr-4
    screen705:px-10
    screen705:mx-auto
    screen705:w-[80%]
    screen550:w-[100%]
    screen450:px-6
    "
    >
      <div className="flex flex-row">
        <div className="w-[20%]">
          <Image
            src="/images/position.svg"
            width={46}
            height={46}
            alt="position"
            className="ml-2  
            screen1560:w-10
            
            "
          />
        </div>
        <div className="w-[80%]">
          <div
            className="text-[#221D23] text-[28px] font-bold my-auto text-right 
          screen1270:text-2xl
          screen890:text-xl
          screen705:text-[28px]
          "
          >
            {item.title}
          </div>

          <div
            className="flex flex-row space-x-4 w-full my-4 justify-self-end
          
          "
          >
            {item?.Tags?.map((tag, index) => {
              return (
                <div key={tag?.id}>
                  <div
                    className={` underline ml-6 screen890:text-sm screen705:text-base
                  ${index === 0 && "text-[#15BF29] "}
                  ${index === 1 && "text-[#FDB900] "}
                  ${index === 2 && "text-[#F24203] "}
                  `}
                  >
                    {tag?.type}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="text-right text-[#919191] mb-5 
          screen950:whitespace-nowrap
          screen890:text-sm
          screen705:text-base
          screen450:whitespace-normal
          "
          >
            {` حقوق دریافتی: ${item?.minSalary} الی ${item?.maxSalary} میلیون تومان`}
          </div>
          <div
            className="text-right text-[#919191] my-4 screen1560:my-3
          screen890:text-sm
          screen705:text-base
          "
          >
            {item.EmploymentType?.type}
          </div>
        </div>
      </div>

      <Link href={`/job-position/${item.id}`}>
        <div
          className="relative overflow-hidden group place-self-end w-full bg-[#A60014] rounded-[50px] text-white text-center py-3  mt-4
            screen1000:place-self-center 
            
            screen1560:py-2
            "
        >
          <span
            className="absolute z-10 bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 
              rounded-full group-hover:opacity-100 group-hover:scale-150 
              bg-gradient-to-r from-[#C4161C] via-[#C4161C] to-[#600B0E]            
            "
          ></span>
          <div
            className="relative z-20 text-white text-lg  rounded-[50px] text-center mx-auto
            screen890:text-base
            screen705:text-lg
            items-center"
          >
            مشاهده
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FirstChildDetails;
