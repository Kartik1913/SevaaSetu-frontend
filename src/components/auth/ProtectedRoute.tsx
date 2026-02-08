import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  allowedRole?: "volunteer" | "ngo";
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
