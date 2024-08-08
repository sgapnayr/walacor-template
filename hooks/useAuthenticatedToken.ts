"use client";

import { useRecoilValue } from "recoil";
import { tokenState } from "@/recoil/atoms";
import { useLogin } from "./useLogin";
import { useEffect } from "react";

const useAuthenticatedToken = () => {
  const { login } = useLogin();
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    if (!token) {
      login();
    }
  }, [token, login]);

  return token;
};

export default useAuthenticatedToken;
