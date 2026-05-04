import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";

import DeleteIcon from "../../../../assets/images/Trash.svg";
import EditIcon from "../../../../assets/images/Edit-profile.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";

const FileDetails = ({ item, index, setDownloads }) => {
  const navigate = useNavigate();

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [responseStatus, setResponseStatus] = useState(0);
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const deleteFileHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/delete-file`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          fileId: item.id,
          exchangeName: item?.Exchange?.name,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        setDownloads((prevStates) => {
          return prevStates.filter((file) => file.id !== item.id);
        });

        setResponseStatus(200);
        break;

      default:
        break;
    }
  };

  return (
    <div className="border border-[#6d6f72] border-opacity-50 rounded-sm w-full grid grid-cols-7 py-2 my-4 text-[#6D6F72]">
      <div className="bg-gradient-to-r to-[#B71F26] from-[#640509] text-white rounded-full w-6 h-6 flex mx-auto items-center justify-center ">
        {index + 1}
      </div>
      <div className="text-center">{item?.title}</div>
      <div className="text-center">{item?.fileType}</div>

      <div className="text-center">{item?.Exchange?.username}</div>
      <div className="text-center">{item?.version}</div>

      <div className="text-center">
        {moment(item?.createdAt).format("jYYYY/jMM/jDD")}
      </div>
      <div className="text-center flex flex-row justify-center  ">
        <div
          onClick={() => {
            navigate("/edit-file", { state: { id: item?.id } });
          }}
          className="bg-black py-1 px-2 w-8 h-8  my-auto rounded-full cursor-pointer flex justify-center items-center"
        >
          <img src={EditIcon} className="w-6 h-6" />
        </div>
        <div
          onClick={() => setShowDeleteBox(true)}
          className="bg-gradient-to-r from-[#640509] to-[#B71F26] mx-2  py-1 px-2 my-auto w-8 h-8  rounded-full cursor-pointer flex justify-center items-center"
        >
          <img src={DeleteIcon} className="brightness-0 invert w-6 h-6" />
        </div>
      </div>

      <div className={`${responseStatus === 200 && " relative"} `}>
        {responseStatus === 200 &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setResponseStatus(0)}
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
                  <img src={CheckCircleIcon} className=" w-20 h-20 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3">
                  .فایل با موفقیت حذف شد
                </div>
                <div
                  onClick={() => setResponseStatus(0)}
                  className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 mt-3"
                >
                  بازگشت به دانلود ها
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>

      <div className={`${showDeleteBox && " relative"} `}>
        {showDeleteBox &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]  opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteBox(false)}
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
                  <img src={CheckCircleIcon} className=" w-20 h-20 mx-auto" />
                </div>
                <div className="text-xl text-right text-white mx-auto w-fit pt-3">
                  آیا از حذف این فایل مطمئن هستید؟
                </div>

                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteBox(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteBox(false);
                      deleteFileHandler();
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

export default FileDetails;
