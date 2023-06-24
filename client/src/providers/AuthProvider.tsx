"use client";
import dynamic from "next/dynamic";
import { FC, PropsWithChildren, useEffect } from "react";
import { TypeComponentAuthFields } from "./auth-page.types";
import { useAuth } from "@/hooks/useAuth";
import { useActions } from "@/hooks/useActions";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
// import { getAccessToken } from "@/services/auth/auth.helper";
// import Cookies from "js-cookie";

const DynamicCheckRole = dynamic(() => import("./CheckRole"), { ssr: false });

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { checkAuth, logout } = useActions();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/login") {
      const accessToken = localStorage.getItem("token");
      if (accessToken) checkAuth();
    }
  }, [pathname]);
  useEffect(() => {
    console.log(user);
  }, [user]);
  // useEffect(() => {
  //   const refreshToken = Cookies.get("refreshToken");
  //   if (!refreshToken && user) logout();
  // }, [pathname]);
  return <DynamicCheckRole>{children}</DynamicCheckRole>;
};
export default AuthProvider;
