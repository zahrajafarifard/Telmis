import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import jobIcon from "../../../../assets/images/job.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";

const JobDetails = ({ item, setJobs }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const deleteHandler = async () => {
    let _response, _data;
    _response = await fetch(`${process.env.REACT_APP_URL}/jobs`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: item?.id,
      }),
    });

    switch (_response.status) {
      case 200:
        _data = await _response.json();
        setJobs((prevStates) => {
          return prevStates?.filter((job) => job.id !== item?.id);
        });
        break;

      default:
        break;
    }
  };
  return (
    <div className="bg-[#F7F7F7] rounded-[8px] py-12 px-8">
      <div className="flex flex-row">
        <div className="w-[20%] ">
          <img src={jobIcon} className="w-12 h-12  mx-auto my-auto" />
        </div>
        <div className="w-[80%] ">
          <div className="text-right text-[#221D23] text-[28px] font-bold mb-5 ">
            {item?.title}
          </div>

          <div className="text-right text-[#919191] mb-5">
            {` حقوق دریافتی: ${
              Number(item?.minSalary)
                ? Number(item?.minSalary)?.toLocaleString()
                : item?.minSalary
            } ${!Number(item?.minSalary) ? "" : "میلیون تومان"}`}
          </div>
          <div className="text-right text-[#919191] leading-[12px] ">
            {item?.EmploymentType?.type}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-8">
        <div
          onClick={() =>
            navigate("/edit-job-position", {
              state: {
                id: item?.id,
              },
            })
          }
          className="bg-[#A60014] text-white border border-[#A60014] rounded-[50px] text-lg py-1 px-12 w-[45%] flex  justify-center cursor-pointer"
        >
          ویرایش
        </div>
        <div
          onClick={() => setShowDeleteModal(true)}
          className="text-[#A60014] border border-[#A60014] text-lg py-1 px-12 rounded-[50px] w-[45%] flex  justify-center  cursor-pointer"
        >
          حذف
        </div>
      </div>

      <div className={`${showDeleteModal && " relative"} `}>
        {showDeleteModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteModal(false)}
              />

              <div
                style={{
                  background: `url(${modalImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="font-Peyda rounded-[15px] py-10 px-20 w-1/3 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0"
              >
                <div className=" w-full mx-auto">
                  <img src={CheckCircleIcon} className=" w-10 h-10 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3 text-center">
                  آیا از حذف این موقعیت شغلی مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteModal(false);
                      deleteHandler();
                    }}
                    className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 ml-2"
                  >
                    حذف
                  </div>
                </div>
              </div>
            </div>,
            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default JobDetails;
