import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ 
  children,
}:ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace/>;
}
