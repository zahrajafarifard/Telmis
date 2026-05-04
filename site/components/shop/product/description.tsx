import React from "react";

interface Props {
  item: string;
}

const Description: React.FC<Props> = ({ item }) => {
  return (
    <div
      style={{ direction: "rtl" }}
      className="text-[#333] text-justify text-xl leading-[46px] mt-10 screen1250:text-lg screen750:text-base screen750:leading-[36px]"
    >
      {item?.length === 0 ? (
        <div>برای اطلاعات بیشتر درباره این محصول، با ما تماس بگیرید.</div>
      ) : (
        item.split("\r\n").map((line, index) => <p key={index}>{line}</p>)
      )}
    </div>
  );
};

export default Description;
