import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";

import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import addIcon2 from "../../../../assets/images/Check_ring.svg";
import addIcon3 from "../../../../assets/images/Add_User.svg";
import editIcon from "../../../../assets/images/Edit_red.svg";
import deleteIcon from "../../../../assets/images/Trash.svg";
import WarningIcon from "../../../../assets/images/error.svg";
import arrowDownIcon from "../../../../assets/images/arrow-down.svg";
import arrowUpIcon from "../../../../assets/images/arrow-up.svg";

const EmploymentType = () => {
  const inputRef = useRef({});

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [showEmploymentTypes, setShowEmploymentTypes] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [employmentId, setEmploymentId] = useState(null);
  const [response, setResponse] = useState("");

  const [addNewEmploymentType, setAddNewEmploymentType] = useState(false);
  const [showDeleteEmploymentTypeModal, setShowDeleteEmploymentTypeModal] =
    useState(false);

  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [newEmploymentType, setNewEmploymentType] = useState("");
  const [editingEmploymentType, setEditingEmploymentType] = useState({
    id: 0,
    type: "",
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);
  const handleClick = (id) => {
    setEditingEmploymentType({
      id: inputRef.current[id].id,
      type: inputRef.current[id].value,
    });
    inputRef.current[id]?.focus();
  };

  useEffect(() => {
    const _employmentType = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/employment-type/${employmentId}`,
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
      _response = await fetch(`${process.env.REACT_APP_URL}/employment-type`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

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

  const deleteEmploymentTypeHandler = async () => {
    setResponse("");
    let _response, _data;
    _response = await fetch(`${process.env.REACT_APP_URL}/employment-type`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        employmentId,
      }),
    });

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

  const addEmploymentTypeHandler = async () => {
    setResponse("");
    setReloading(false);
    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/employment-type`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        newEmploymentType,
      }),
    });

    switch (_response.status) {
      case 201:
        setNewEmploymentType("");
        setReloading(true);
        setAddNewEmploymentType(false);

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
  const editEmploymentTypeHandler = async () => {
    setResponse("");
    setReloading(false);

    let _response, _data;

    _response = await fetch(`${process.env.REACT_APP_URL}/employment-type`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        editingEmploymentType,
      }),
    });

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

  return (
    <div>
      {response && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      <div className="w-[90%] mx-auto my-10">
        <div className="bg-[#F7F7F7] rounded-[15px] p-4">
          <div className="flex flex-row justify-between">
            <span className="text-[#221D23] text-xl mr-2 my-auto">
              نوع همکاری
            </span>
            <div className="flex flex-row">
              <div
                onClick={() => {
                  setAddNewEmploymentType(true);
                  setShowEmploymentTypes(true);
                }}
                className="bg-red-800 rounded-[4px] p-1"
              >
                <img src={addIcon3} className="w-8 h-8" />
              </div>
              <div
                onClick={() => {
                  setShowEmploymentTypes((prev) => !prev);
                }}
                className="ml-2 bg-white rounded-[4px] p-1 mr-1"
              >
                <img
                  src={showEmploymentTypes ? arrowDownIcon : arrowUpIcon}
                  className="w-8 h-8"
                />
              </div>
            </div>
          </div>
          {showEmploymentTypes ? (
            <div className="border-t mt-4 pt-4 grid grid-cols-2 gap-4">
              {employmentTypes?.map((item) => {
                return (
                  <div key={item.id} className="flex flex-row">
                    <input
                      ref={(el) => (inputRef.current[item.id] = el)}
                      id={item?.id}
                      defaultValue={item?.type}
                      className="text-[#221D23] w-full px-2 rounded-[4px] text-xl outline-none"
                      readOnly={employmentId !== item.id}
                      onChange={(e) => {
                        setEditingEmploymentType({
                          id: item.id,
                          type: e.target.value,
                        });
                      }}
                    />
                    <div
                      onClick={() => {
                        setEmploymentId(item?.id);
                        setShowDeleteEmploymentTypeModal(true);
                      }}
                      className="bg-white rounded-[4px] p-1 mr-2"
                    >
                      <img src={deleteIcon} className="w-8 h-8" />
                    </div>
                    {employmentId == item?.id &&
                    editingEmploymentType.type !== "" ? (
                      <div
                        onClick={() => {
                          editEmploymentTypeHandler();
                        }}
                        className="bg-white rounded-[4px] p-1 mr-2 flex justify-center items-center text-[#A60014] text-sm cursor-pointer"
                      >
                        ویرایش
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEmploymentId(item?.id);
                          handleClick(item?.id);
                        }}
                        className="bg-white rounded-[4px] p-1 mr-2"
                      >
                        <img src={editIcon} className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                );
              })}

              {addNewEmploymentType && (
                <div className="flex flex-row space-x-2 space-x-reverse">
                  <input
                    value={newEmploymentType}
                    className="text-[#221D23] w-full px-2 rounded-[4px] text-xl outline-none"
                    onChange={(e) => {
                      setNewEmploymentType(e.target.value);
                    }}
                  />

                  <div
                    onClick={() => {
                      addEmploymentTypeHandler();
                    }}
                    className="rounded-[4px] py-2 px-4 cursor-pointer bg-[#A60014] flex flex-row justify-center space-x-1 space-x-reverse"
                  >
                    <img src={addIcon2} className="w-6 h-6" />
                    <span className="text-white">ثبت</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={`${showDeleteEmploymentTypeModal && " relative"} `}>
        {showDeleteEmploymentTypeModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteEmploymentTypeModal(false)}
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
                  آیا از حذف این دسته بندی مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteEmploymentTypeModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteEmploymentTypeModal(false);
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
