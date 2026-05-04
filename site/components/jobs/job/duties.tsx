import React from "react";

interface DutiesProps {
  duties: string;
}

const Duties: React.FC<DutiesProps> = ({ duties }) => {
  const items = duties.split("\n");

  const trimmedItems = items.map((item) => item.trim());

  if (trimmedItems?.length === 0) {
    return (
      <div style={{ direction: "rtl" }} className="w-full text-right">
        برای دریافت اطلاعات بیشتر با تلمیس تماس بگیرید .
      </div>
    );
  }
  return (
    <div className="">
      <div style={{ direction: "rtl" }}>
        <ul
          className="list-[square] list-inside space-y-4 text-[#333] text-[20px] leading-[56px]
        screen1000:leading-[46px]
        screen1000:space-x-0
        screen1000:text-lg
        "
        >
          {trimmedItems?.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Duties;
