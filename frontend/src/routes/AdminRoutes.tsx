import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { PermissionKeys } from "../types/auth";


interface Props {
  requiredPermission: string;
}

export function PermissionRoute({ requiredPermission }: Props) {
  const { token, user} = useAppSelector(
    (s) => s.auth
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // f;aten premissions for roles
  const permissions = user.role.flatMap((r) => r.permissions);

  const canAccess = permissions.includes(requiredPermission);

  if (!canAccess) {
    return <Navigate to="/" replace/>
  }

  return <Outlet />;
}
