import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function AdminRoute(){
  const { token, user} = useAppSelector(
    (state) => state.auth
  );

  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
