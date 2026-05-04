import React from "react";
import moment from "moment-jalaali";

const LoginDetails = ({ item, index }) => {
  return (
    <div
      style={{ direction: "rtl" }}
      className="border border-[#D9D9D9] border-opacity-50 rounded-sm  grid grid-cols-5 my-4 w-[100%] mx-auto py-3 text-sm text-[#221D23] "
    >
      <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] w-5 h-5 rounded-full text-white mx-auto flex items-center justify-center">
        {index + 1}
      </div>
      <div className="my-auto mx-auto">{item?.device}</div>
      <div className="my-auto mx-auto">
        {moment(item?.login).format("jYYYY/jMM/jDD HH:mm:ss")}
      </div>
      <div className="my-auto mx-auto">{item?.ip}</div>
      <div></div>
    </div>
  );
};

export default LoginDetails;
