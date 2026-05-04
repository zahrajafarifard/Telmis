import { create } from "zustand";

interface CheckPasswordState {
  mobile: string | undefined;
  captcha: string | undefined;
  setDetails: (mobile: string, captcha: string) => void;
}

export const useNavigateMobile = create<CheckPasswordState>((set) => ({
  mobile: undefined,
  captcha: undefined,
  setDetails: (mobile, captcha) => set({ mobile, captcha }),
}));
