"use client";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import { RootState } from "@/store/store";
import Login from "./log-in/page";

export default function Home() {
  const router = useRouter();
  const _token = useSelector((state: RootState) => state.client.token);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    if (!_token) {
      return;
    }

    const handleJobPositionRedirect = async () => {
      if (redirectTo?.includes("job-position")) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/clients`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${_token}`,
              },
            }
          );

          if (response.status === 200) {
            const data = await response.json();

            if (data?.data?.resume) {
              setCookie("token", _token, {
                maxAge: 60 * 60 * 2,
                domain: ".telmis.ir",
                path: "/",
                secure: true,
                sameSite: "none",
              });

              setCookie("isResumeSentToAdmin", "true", {
                maxAge: 60 * 60 * 2,
                domain: ".telmis.ir",
                path: "/",
                secure: true,
                sameSite: "none",
              });

              router.push(redirectTo);
            } else {
              router.push(`/client/resume?redirectTo=${redirectTo}`);
            }
          } else {
            console.error("Failed to fetch client data", response.status);
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      }
    };

    const handleGeneralRedirect = () => {
      if (redirectTo && !redirectTo.includes("job-position")) {
        setCookie("token", _token, {
          maxAge: 60 * 60 * 2,
          domain: ".telmis.ir",
          path: "/",
          secure: true,
          sameSite: "none",
        });
        router.push(redirectTo);
      } else {
        router.push("/client/overall-view");
      }
    };

    if (_token) {
      handleJobPositionRedirect();
      handleGeneralRedirect();
    }
  }, [_token, redirectTo, router]);

  if (!_token) {
    return <Login />;
  }

  return <div>{/* <Login /> :)  */}</div>;
}
