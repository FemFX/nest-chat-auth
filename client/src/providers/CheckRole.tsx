"ise client";
import { FC, PropsWithChildren } from "react";
import { TypeComponentAuthFields } from "./auth-page.types";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

const CheckRole: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (user) {
    return <>{children}</>;
  }
  pathname !== "/login" && router.replace("/login");
  return <>{children}</>;
};
export default CheckRole;
