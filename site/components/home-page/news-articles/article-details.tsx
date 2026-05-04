import React from "react";
import Image, { StaticImageData } from "next/image";

interface ArticleDetailsProps {
  img: string | StaticImageData;
  title: string;
  text: string;
  athour: string;
  date: string;
}

const ArticleDetails: React.FC<ArticleDetailsProps> = ({
  img,
  title,
  text,
  athour,
  date,
}) => {
  return (
    <div className=" rounded-[10px] bg-white mb-24 pb-7">
      <Image
        src={img}
        alt="مقاله"
        width={550} // Specify desired width
        height={290} // Specify desired height
        style={{ objectFit: "cover" }}
        className="rounded-[10px]  h-[300px]"
      />
      <div className=" flex flex-col justify-between ">
        <div className="text-[#221D23] text-lg mt-6 mb-3 pr-4">{title}</div>
        <div className="text-[#A60014] text-2xl pr-4">{text}</div>
        <div>
          <div className="text-[#919191] text-sm  pr-4 mb-2">{athour}</div>
          <div className="text-[#919191] text-sm  pr-4">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
