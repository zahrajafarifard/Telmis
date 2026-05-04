import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import editIcon from "../../../assets/images/Edit Square.svg";
import saveIcon from "../../../assets/images/Check_ring.svg";
import refreshIcon from "../../../assets/images/Refresh_black.svg";

const bannerSizes = [
  { label: "فایل بنر سایز 1 (عرض 1980)", key: "screen1980" },
  { label: "فایل بنر سایز 2 (عرض 1440)", key: "screen1440" },
  { label: "فایل بنر سایز 3 (عرض 900)", key: "screen900" },
  { label: "فایل بنر سایز 4 (عرض 500)", key: "screen500" },
];

const ShopHeader = () => {
  const token = useSelector((state) => state.reducer.token);
  const [link, setLink] = useState("");
  const [images, setImages] = useState({});
  const [previews, setPreviews] = useState({});
  const refs = useRef([]);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [key]: file }));
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("link", link);
    formData.append("title", "shop-header");

    bannerSizes.forEach(({ key }) => {
      if (images[key]) formData.append(key, images[key]);
    });

    try {
      const res = await fetch(`${process.env.REACT_APP_URL}/banner`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

      const data = await res.json();
      console.log("ShopHeader updated:", data);
    } catch (error) {
      console.error("Error uploading banners:", error);
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/banner`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        const banner = data[0];
        if (banner) {
          setLink(banner.link || "");

          const loadedPreviews = {};
          bannerSizes.forEach(({ key }) => {
            if (banner[`image_${key}`]) {
              const filename = banner[`image_${key}`]
                .replace(/\\/g, "/")
                .split("/")
                .pop();
              loadedPreviews[
                key
              ] = `${process.env.REACT_APP_URL}/uploads/banners/${filename}`;
            }
          });

          setPreviews(loadedPreviews);
        }
      });
  }, [token]);

  const renderBannerUpload = (label, key, index) => (
    <div key={key}>
      <div className="text-[#221D23] text-[20px] text-right">{label}</div>
      <div className="my-2 border border-[#D9D9D9] rounded-[10px] overflow-hidden h-56">
        {previews[key] ? (
          <img
            className="w-full h-full object-cover"
            src={previews[key]}
            alt={`preview-${key}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            پیش‌نمایش موجود نیست
          </div>
        )}
      </div>
      <div
        onClick={() => refs.current[index].click()}
        className="bg-[#A60014] flex flex-row justify-center rounded-[8px] cursor-pointer"
      >
        <img src={editIcon} className="w-6 h-6 my-auto" alt="edit" />
        <span className="text-white text-lg mr-2 py-3 my-auto">ویرایش</span>
      </div>
      <input
        ref={(el) => (refs.current[index] = el)}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFileChange(e, key)}
      />
    </div>
  );

  return (
    <div className="w-[90%] mx-auto my-8">
      <div>
        <div className="flex flex-row space-x-4 space-x-reverse w-full mb-8">
          <div className="text-[#221D23] text-2xl my-auto">بنر هدر فروشگاه</div>
          <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
        </div>

        <div className="text-[#221D23] text-[20px] text-right mb-2">
          لینک مرتبط
        </div>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="bg-[#F7F7F7] text-[#8F8F8F] p-4 w-full rounded-[8px] outline-none mb-8"
          placeholder="لینک مرتبط با بنر را وارد کنید"
        />

        <div className="grid grid-cols-4 gap-x-11 mb-12">
          {bannerSizes.map((item, index) =>
            renderBannerUpload(item.label, item.key, index)
          )}
        </div>

        <div className="my-20 flex flex-row justify-center space-x-4 space-x-reverse ">
          <button
            onClick={handleSubmit}
            className="bg-[#A60014] text-white px-6 py-3 w-1/3  rounded-[50px] flex flex-row-reverse justify-center "
          >
            <span className="mr-2">ذخیره تغییرات</span>
            <span>
              <img src={saveIcon} width={23} height={23} alt="save" />
            </span>
          </button>
          <button
            onClick={() => console.log("reeeeefresh")}
            className="bg-white text-[#221D23] w-1/3 border border-[#221D23] px-6 py-3 justify-center  rounded-[50px] flex flex-row-reverse "
          >
            <span className="mr-2"> تنظیم مجدد</span>
            <span>
              <img src={refreshIcon} width={23} height={23} alt="save" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
