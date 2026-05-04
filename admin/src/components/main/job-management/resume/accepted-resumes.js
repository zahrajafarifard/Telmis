import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Pagination from "../../../shared-component/pagination";
import errIcn from "../../../../assets/images/error2.svg";
import Details from "./accepted-resumes-details";
import actionIcn from "../../../../assets/images/actions.svg";
import refuseIcon from "../../../../assets/images/refuse.svg";
import phonIcon from "../../../../assets/images/Phone.svg";
import calIcon from "../../../../assets/images/Calendar.svg";
import userIcon from "../../../../assets/images/account_circle.svg";

const AcceptedResumes = ({}) => {
  const [checkedResumes, setCheckedResumes] = useState([]);
  const [resumes, setResumes] = useState([]);
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _resumes = async () => {
      try {
        let _response, _data;
        _response = await fetch(
          `${process.env.REACT_APP_URL}/resume/accepted-resumes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ page: currentPage, pageSize: itemsPerPage }),
          }
        );

        switch (_response.status) {
          case 200:
            _data = await _response.json();

            setResumes(_data?.data.rows);
            settTotalItems(_data?.data.count);

            break;

          default:
            break;
        }
      } catch (error) {
        console.log("eee", error);
      }
    };

    token && _resumes();
  }, [token, totalItems, currentPage]);

  const deleteResumeHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/resume/delete-resumes`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          resumes: checkedResumes,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        checkedResumes?.map((cv) => {
          return setResumes((prevStates) => {
            return prevStates.filter((item) => item.id !== cv.id);
          });
        });

        setCheckedResumes("");
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="bg-[#F7F7F7] w-full mx-auto mt-14 mb-2 grid grid-cols-7 py-4 rounded-[4px] border-[#D9D9D9] ">
        <span className="text-[#919191] text-sm my-auto">گزینه</span>
        <div className="flex flex-row justify-center space-x-2 space-x-reverse">
          <img src={userIcon} />
          <span className="text-[#919191] text-sm my-auto">نام کاربری</span>
        </div>
        <div className="flex flex-row justify-center space-x-2 space-x-reverse">
          <img src={phonIcon} />
          <span className="text-[#919191] text-sm my-auto">شماره تماس </span>
        </div>
        <div className="flex flex-row justify-center space-x-2 space-x-reverse">
          <img src={calIcon} />
          <span className="text-[#919191] text-sm my-auto">تاریخ </span>
        </div>

        <div className="col-span-3">
          {checkedResumes?.length !== 0 ? (
            <div className="text-center flex flex-row justify-center">
              <div
                onClick={deleteResumeHandler}
                className="w-1/2 text-white bg-[#A60014] flex flex-row justify-center mx-2 p-1 rounded-[100px] cursor-pointer"
              >
                <img src={refuseIcon} className="w-4 h-4 my-auto ml-2" />
                حذف رزومه (ها)
              </div>
            </div>
          ) : (
            <div className=" flex flex-row justify-center space-x-2 space-x-reverse">
              <img src={actionIcn} />
              <span className="text-[#919191] text-sm my-auto">عملیات</span>
            </div>
          )}
        </div>
      </div>
      <div>
        {resumes.length === 0 ? (
          <div className="text-[#6D6F72] text-2xl my-auto mx-auto h-full flex flex-col items-center justify-center mt-44">
            <img src={errIcn} className="mb-3 w-20 h-20 " />
            <span>هیچ رزومه وجود ندارد!</span>
          </div>
        ) : (
          resumes?.map((resume) => {
            return (
              <div key={resume.id}>
                <Details
                  item={resume}
                  setCheckedResumes={setCheckedResumes}
                  setResumes={setResumes}
                />
              </div>
            );
          })
        )}
      </div>

      <div className="">
        {resumes?.length !== 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default AcceptedResumes;
