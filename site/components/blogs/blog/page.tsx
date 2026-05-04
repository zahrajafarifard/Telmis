import React, { FC } from "react";
import Image from "next/image";
import moment from "moment-jalaali";

interface BlogProps {
  item: {
    id: number;
    articleTitle: string;
    shortDescription: string;
    author: string;
    mainImage: string;
    ArticleType: { id: number; type: string };
    createdAt: string;
    sectionOneTitle: string;
    sectionOneText: string;
    sectionTwoImage: string;
    sectionTwoTitle: string;
    sectionTwoText: string;
    sectionThreeTitle: string;
    sectionThreeText: string;
  };
}
const Blog: FC<BlogProps> = ({ item }) => {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  return (
    <div
      className="w-[70%] mx-auto mt-14 screen1250:w-[80%]
      screen750:w-[90%]"
    >
      <div className="flex flex-row-reverse justify-start ">
        <div className=" w-10 h-10 rounded-full my-auto">
          <Image
            src="/images/avatar.png"
            width={51}
            height={51}
            className="my-auto"
            alt="عکس نویسنده"
          />
        </div>
        <div className="mr-3">
          <div className=" text-[#B3323A] leading-[32px] font-bold text-right text-2xl">
            {item?.author}
          </div>

          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6E76]  text-xs text-right leading-[30px]"
          >
            {moment(item?.createdAt).format("jDD jMMMM  jYYYY")} &nbsp; آپلود
            شده
          </div>
        </div>
      </div>

      <div
        style={{ direction: "rtl" }}
        className="text-[#232536] font-bold text-[40px] leading-[80px] text-right mt-6 
        screen1250:leading-[48px] 
        screen1250:text-[30px]
        screen750:text-[20px]
        screen750:leading-[34px]
        "
      >
        {item?.articleTitle}
      </div>

      <div
        className="w-full h-[500px] mx-auto my-20  relative
      screen1250:my-14
      screen750:my-9
      screen1250:h-[400px] 
      screen750:h-[320px] 
      "
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/article/${item?.mainImage}`}
          layout="fill"
          objectFit="cover"
          alt="عکس مقاله"
          className="rounded-[16px] mx-auto "
        />
      </div>

      <div
        className="text-[38px] font-[600] leading-[67px] text-right mb-5
       screen1250:leading-[48px] 
        screen1250:text-[30px]
        screen750:text-[20px]
        screen750:leading-[36px]
        tracking-[0.2px]
      "
      >
        {item?.sectionOneTitle}
      </div>
      <div
        style={{ direction: "rtl" }}
        className="text-[#919191] text-[20px] leading-[42px] text-justify mb-8
        
          screen1250:leading-[36px] 
        screen1250:text-[18px]
        screen750:text-base
        screen750:leading-[29px]
        
        "
      >
        {item?.sectionOneText}
      </div>

      <div
        className="text-[38px] font-[600] leading-[67px] text-right mb-5 screen1250:leading-[48px] 
        screen1250:text-[30px]
        screen750:text-[20px]
        screen750:leading-[36px]
        tracking-[0.2px]"
      >
        {item?.sectionTwoTitle}
      </div>

      <div className="flex flex-row mb-8
        
        ">
        <div className="w-1/2 flex items-stretch ">
          <div className="w-full relative flex items-center justify-center mr-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/article/${item?.sectionTwoImage}`}
              layout="fill"
              objectFit="cover"
              alt=""
              className="h-full object-cover rounded-[16px]"
            />
          </div>
        </div>

        <div
          style={{ direction: "rtl" }}
          className="w-1/2 ml-4 text-[#919191] text-[20px] leading-[42px] text-justify flex items-center 
        
          screen1250:leading-[36px] 
        screen1250:text-[18px]
        screen750:text-base
        screen750:leading-[29px]"
        >
          <p>{item?.sectionTwoText}</p>
        </div>
      </div>

      <div
        className="text-[38px] font-[600] leading-[67px] text-right mb-5 screen1250:leading-[48px] 
        screen1250:text-[30px]
        screen750:text-[20px]
        screen750:leading-[36px]
        tracking-[0.2px]"
      >
        {item?.sectionThreeTitle}
      </div>
      <div
        style={{ direction: "rtl" }}
        className="text-[#919191] text-[20px] leading-[42px] text-justify
        
          screen1250:leading-[36px] 
        screen1250:text-[18px]
        screen750:text-base
        screen750:leading-[29px]"
      >
        {item?.sectionThreeText}
      </div>
    </div>
  );
};

export default Blog;
