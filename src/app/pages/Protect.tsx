import type { ReactNode } from "react";
import Error4 from "../components/Error4";

const Protect = ({ children }: { children: ReactNode }) => {
  const userLogin = localStorage.getItem("igbo_token");
  return userLogin ? <>{children}</> : <Error4 />;
};

export default Protect;
