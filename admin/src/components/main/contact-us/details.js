import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment-jalaali";

const RequestDetails = ({
  name,
  mobile,
  date,
  rating,
  comment,

  index,
}) => {
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  return (
    <div className="grid grid-cols-6 text-[#6D6F72] border text-sm rounded-sm my-4 py-2">
      <p className="bg-gradient-to-r from-[#A60014] to-[#600B0E] rounded-full w-8 h-5 mx-auto my-auto text-white text-xs flex items-center justify-center">
        {index + 1}
      </p>

      <div className="text-center my-auto">{name}</div>

      <div className="text-center my-auto">{mobile}</div>
      <div className="text-center my-auto col-span-2 line-clamp-1 hover:line-clamp-none">
        {comment}
      </div>

      <div className="text-center my-auto">
        {moment(date).format("jYYYY/jMM/jDD")}
      </div>
    </div>
  );
};

export default RequestDetails;
