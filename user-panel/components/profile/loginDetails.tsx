import React from "react";
import moment from "moment-jalaali";

interface loginType {
  id: number;
  mobile: string;
  image: string;
  ip: string;
  device: string;
  login: string;
}

interface Props {
  item: loginType;
  index: number;
}
const LoginDetails: React.FC<Props> = ({ item, index }) => {
  return (
    <div
      style={{ direction: "rtl" }}
      className="grid grid-cols-5 place-items-center border border-[#D9D9D9]  mx-auto py-2 rounded-[4px] text-sm text-[#919191] my-5"
    >
      <span className="bg-gradient-to-r from-[#A60014] to-[#600B0E] text-xs rounded-full text-white flex justify-center items-center w-5 h-5">
        {index + 1}
      </span>
      <span className="text-[#6D6F72] text-sm text-center">{item?.device}</span>
      <span className="text-[#6D6F72] text-sm">
        {moment(item.login).format("jYYYY/jMM/jDD")}
      </span>
      <span className="text-[#6D6F72] text-sm text-center">{item?.ip}</span>
    </div>
  );
};

export default LoginDetails;
