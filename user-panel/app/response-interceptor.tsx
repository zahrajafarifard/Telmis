"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { logOut } from "../store/slices/client";

const FetchInterceptor = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (
      ...args: Parameters<typeof fetch>
    ): Promise<Response> => {
      try {
        const response: Response = await originalFetch(...args);

        if (response?.status === 401) {
          dispatch(logOut());
          router.push("/");
        }

        return response;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch; // Restore the original fetch function
    };
  }, [dispatch, router]);

  return null; // This component renders nothing
};

export default FetchInterceptor;
