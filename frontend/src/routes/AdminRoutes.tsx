import { Navigate, Outlet } from "react-router-dom";
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

  return <Outlet />;
}
