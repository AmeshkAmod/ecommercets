<<<<<<< Updated upstream
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
=======
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
>>>>>>> Stashed changes
}
