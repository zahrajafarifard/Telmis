"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { RootState } from "@/store/store";
import uploadIcon from "@/public/images/upload.svg";
import successIcon from "@/public/images/Check_ring.svg";
import ErrorIcon from "@/public/images/error.svg";
import Spinner from "@/components/shared/spinner/page";

const ResumeUpload = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const _token = useSelector((state: RootState) => state.client.token);
  const redirectTo = searchParams.get("redirectTo");

  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // error && setError(null);
      // uploadSuccess && setUploadSuccess(false);
      if (error) {
        setError(null);
      }
      if (uploadSuccess) {
        setUploadSuccess(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [error, uploadSuccess]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        !fileType.includes("pdf") &&
        !fileType.includes("doc") &&
        !fileType.includes("docx")
      ) {
        setError("Please upload a valid document (PDF, DOC, DOCX).");
        return;
      }

      setError(null);
      await uploadFile(selectedFile); // Auto-upload file
    }
  };

  const handleTextClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resume/upload-resume`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + _token,
          },
          body: formData,
        }
      );

      switch (response.status) {
        case 200:
          setUploadSuccess(true);

          const data = await response.json();

          if (redirectTo) {
            setCookie("isResumeSentToAdmin", data?.data?.isResumeSentToAdmin, {
              maxAge: 60 * 60 * 2,
              domain: ".telmis.ir",
              path: "/",
              secure: true,
              sameSite: "none",
            });
            router.push(`${redirectTo}`);
          }
          break;

        default:
          setError("آپلود ناموفق بود. لطفاً دوباره تلاش کنید.");
          break;
      }
    } catch (error) {
      console.log(error);

      setError("آپلود ناموفق بود. لطفاً دوباره تلاش کنید.");
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return <Spinner />;
  }
  return (
    <div className="relative">
      <div className="w-[90%] mx-auto my-14">
        <div
          style={{ direction: "rtl" }}
          className="text-[#333] text-xl font-semibold bg-[#F7F7F7] py-2 ps-10 rounded-t-lg "
        >
          آپلود رزومه
        </div>
        <div className="border border-t-0 rounded-b-lg">
          <input
            type="file"
            ref={fileInputRef}
            // accept=".pdf,.doc,.docx"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <Image
            src={uploadIcon}
            width={102}
            height={102}
            alt="بارگذاری رزومه"
            className="mx-auto pt-20"
          />
          <p
            onClick={handleTextClick}
            className="text-[#A60014] cursor-pointer underline text-center -mt-4 mb-14"
          >
            رزومه خود را بارگذاری کنید
          </p>

          {error && (
            <div className="absolute -top-20 right-0 rounded-s-[8px] bg-[#FFF099] flex flex-row-reverse w-fit pr-16 pl-10">
              <Image src={ErrorIcon} width={20} height={20} alt="" />
              <div
                style={{ direction: "rtl" }}
                className=" text-[#D76B00]  py-4 mr-2 whitespace-nowrap"
              >
                {error}
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="absolute -top-20 right-0 rounded-s-[8px] bg-[#CBEDCB] flex flex-row-reverse w-fit pr-16 pl-10">
              <Image
                src={successIcon}
                width={20}
                height={20}
                alt="ایکن عملیات موفق"
              />
              <div
                style={{ direction: "rtl" }}
                className=" text-[#219235]  py-4 mr-2 whitespace-nowrap"
              >
                رزومه با موفقیت آپلود شد.
              </div>
            </div>
          )}

          {/* Show selected file name */}
          {/* {file && !uploading && (
          <p className="text-green-500 text-sm mt-2">
            Selected file: {file.name}
          </p>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
