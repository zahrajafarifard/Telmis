import React from "react";

interface Props {
  item: [{ id: number; key: string; value: string; selected: boolean }];
}

const Specifications: React.FC<Props> = ({ item }) => {
  return (
    <div
      style={{ direction: "rtl" }}
      className="text-[#333] text-justify text-xl leading-[46px] mt-10 screen1250:text-lg screen750:text-base screen750:leading-[36px]"
    >
      {!item ? (
        <div>
          برای اطلاعات بیشتر درباره مشخصات این محصول، با ما تماس بگیرید.
        </div>
      ) : (
        <div>
          {item?.map((spec: any, index: number) => {
            return (
              <div
                key={spec.id}
                className={`
                  py-3 px-6 rounded-sm grid grid-cols-3 gap-x-2
                  ${index % 2 === 0 ? "bg-[#FAFAFA]" : "bg-white"}`}
              >
                <div className="text-[#919191] text-lg ">{spec?.key}</div>
                <div className="col-span-2 text-[#221D23] text-lg">
                  {spec?.value}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Specifications;
