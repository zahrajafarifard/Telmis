import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import CheckCircleIcon from "../../../assets/images/Check_ring.svg";
import addIcon2 from "../../../assets/images/Check_ring.svg";
import modalImage from "../../../assets/images/modalBack.png";
import catIcon from "../../../assets/images/Bookmark.svg";
import addIcon from "../../../assets/images/Add_ring.svg";
import editIcon from "../../../assets/images/Edit_red.svg";
import deleteIcon from "../../../assets/images/Remove.svg";

const EmploymentType = ({
  setReloading,
  reloading,
  setEmploymentId,
  employmentId,
}) => {
  const [response, setResponse] = useState("");

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [response]);

  const [showDeleteEmploymentModal, setShowDeleteEmploymentModal] =
    useState(false);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  const [showAddEmploymentType, setShowAddEmploymentType] = useState("");
  const [newEmploymentType, setNewEmploymentType] = useState("");
  const [editingEmploymentType, setEditingEmploymentType] = useState({
    id: 0,
    type: "",
  });

  useEffect(() => {
    const _employmentType = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/employment-type/${employmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setEditingEmploymentType({
            id: _data?.data?.id,
            type: _data?.data?.type,
          });

          break;

        default:
          break;
      }
    };

    token && employmentId && _employmentType();
  }, [token, employmentId]);

  useEffect(() => {
    const _employmentTypes = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/employment-types`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setEmploymentTypes(_data?.data);
          break;

        default:
          break;
      }
    };

    token && _employmentTypes();
  }, [token, reloading, setEmploymentTypes]);

  const editEmploymentTypeHandler = async () => {
    setResponse("");
    setReloading(false);
    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/edit-employment-type`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          editingEmploymentType,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        setReloading(true);

        break;
      case 409:
        setReloading(true);
        setResponse("مقدار وارد شده تکراری می باشد.");
        break;
      case 500:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;

      default:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;
    }
  };

  const addEmploymentTypeHandler = async () => {
    setResponse("");
    setReloading(false);
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/add-employment-type`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          newEmploymentType,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        setNewEmploymentType("");
        setReloading(true);

        break;
      case 409:
        setReloading(true);
        setResponse("مقدار وارد شده تکراری می باشد.");
        break;
      case 500:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;

      default:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;
    }
  };

  const deleteEmploymentTypeHandler = async () => {
    setResponse("");
    let _response, _data;
    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/delete-employment-type`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          employmentId,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();
        setEmploymentTypes((prevStates) => {
          return prevStates?.filter((item) => item.id !== employmentId);
        });

        break;

      case 409:
        setResponse("you are not allowed to delete ...");
        break;

      default:
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;
    }
  };

  return (
    <div>
      <div className="my-14 w-full ">
        <div className=" bg-[#F7F7F7] flex flex-row rounded-t-[10px] pr-10 py-4  ">
          <img src={catIcon} className="w-6 h-6 my-auto" />
          <span className="text-[#221D23] text-xl mr-2 my-auto">نوع کار</span>
        </div>

        <div className="border border-t-0 max-h-[195px] overflow-auto">
          {employmentTypes?.map((item) => {
            return (
              <div key={item.id} className="w-full flex pr-10 py-4">
                <input
                  checked={employmentId === item.id} // Check if the current item is the selected one
                  onChange={() => {
                    setEmploymentId((prevId) =>
                      prevId === item?.id ? null : item?.id
                    );
                  }}
                  type="checkbox"
                  className="my-auto accent-[#A60014] border border-[#A60014] w-5 h-5"
                />
                <span className="my-auto mr-2 text-[#7A7A7A] ">
                  {item?.type}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-b-[8px] border border-t-0 py-4 px-10 ">
          <div className="flex flex-row justify-between">
            <div
              onClick={() => {
                setShowAddEmploymentType("add");
              }}
              className="flex mb-4"
            >
              <img src={addIcon} className="w-6 h-6" />
              <span className="text-[#A60014] underline mr-2">
                افزودن نوع جدید
              </span>
            </div>
            <div
              onClick={() => {
                setShowAddEmploymentType("edit");
              }}
              className="flex mb-4"
            >
              <img src={editIcon} className="w-6 h-6" />
              <span className="text-[#A60014] underline mr-2">ویرایش </span>
            </div>
            <div
              onClick={() => {
                setShowDeleteEmploymentModal(true);
              }}
              className="flex mb-4 cursor-pointer"
            >
              <img src={deleteIcon} className="w-6 h-6" />
              <span className="text-[#A60014] underline mr-2">حذف </span>
            </div>
          </div>

          {showAddEmploymentType === "add" && (
            <div className="flex flex-row justify-between">
              <input
                value={newEmploymentType}
                onChange={(e) => {
                  setNewEmploymentType(e.target.value);
                }}
                placeholder=" نوع کار جدید را وارد کنید"
                className="bg-[#F7F7F7] text-[#8F8F8] p-4 text-xs w-[85%] rounded-[5px] focus:outline-none"
              />
              <div
                onClick={addEmploymentTypeHandler}
                className="bg-[#A60014] rounded-[4px] w-12 flex justify-center items-center cursor-pointer"
              >
                <img src={addIcon2} className="w-7 h-7" />
              </div>
            </div>
          )}
          {showAddEmploymentType === "edit" && (
            <div className="flex flex-row justify-between">
              <input
                value={editingEmploymentType.type}
                onChange={(e) => {
                  setEditingEmploymentType((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }));
                }}
                placeholder=" نوع کار جدید را وارد کنید"
                className="bg-[#F7F7F7] text-[#8F8F8] p-4 text-xs w-[85%] rounded-[5px] focus:outline-none"
              />
              <div
                onClick={editEmploymentTypeHandler}
                className="bg-[#A60014] rounded-[4px] w-12 flex justify-center items-center cursor-pointer"
              >
                <img src={addIcon2} className="w-7 h-7" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${showDeleteEmploymentModal && " relative"} `}>
        {showDeleteEmploymentModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteEmploymentModal(false)}
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
                <div className="text-xl text-white mx-auto w-fit pt-3">
                  آیا از حذف این نوع کار مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteEmploymentModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteEmploymentModal(false);
                      deleteEmploymentTypeHandler();
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

export default EmploymentType;
