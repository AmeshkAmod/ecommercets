import { Navigate, Outlet } from "react-router-dom";
<<<<<<< Updated upstream
import { useAppSelector } from "../store/hooks";
import { PermissionKeys } from "../types/auth";


interface Props {
  requiredPermission: string;
}

export function PerminssionRoute({ requiredPermission }: Props) {
  const { token, user} = useAppSelector(
    (state) => state.auth
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // f;aten premissions for roles
  const permissions = user.role.flatMap((r) => r.permissions);

  const canAccess = permissions.includes(
    PermissionKeys.CREATE_PRODUCT
  )

  if (!permissions.includes) {
    return <Navigate to="/" replace/>
  }

=======

export default function AdminRoute(){
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

>>>>>>> Stashed changes
  return <Outlet />;
}
