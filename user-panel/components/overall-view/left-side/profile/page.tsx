"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import "@/components/shared/style.css";

interface ClientType {
  id: number;
  mobile: string;
  name: string;
  image: string;
}
const Profile = () => {
  const _token = useSelector((state: RootState) => state.client.token);
  const [client, setClient] = useState<ClientType>();

  useEffect(() => {
    const fetchClient = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setClient(data?.data);
          break;

        default:
          break;
      }
    };

    // _token && fetchClient();

    if (_token) {
      fetchClient();
    }
  }, [_token]);

  return (
    <div className="w-full mx-auto  mt-8">
      <div
        className={`w-28 h-28 overflow-hidden mx-auto rounded-full ${
          !client?.image && "bg-[#d9d9d9]"
        } `}
      >
        {client?.image && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${client?.image
              ?.split(/[\/\\]/)
              .pop()}`}
            className="w-full rounded-full object-cover"
            width={112}
            height={112}
            alt=""
          />
        )}
      </div>
      <div className="text-center text-[#333] text-xl font-bold mt-2 mb-1">
        {client?.name}
      </div>
      <div className="text-center text-[#919191] text-sm">{client?.mobile}</div>
      <Link href={"/client/profile"}>
        <div className="button bg-[#A60014] w-fit px-12 py-2 text-sm rounded-full mx-auto text-white my-2">
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text "> پروفایل </p>
        </div>
      </Link>
    </div>
  );
};

export default Profile;
