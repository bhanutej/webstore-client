import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  if (!authUser) {
    return <Navigate to="/login" replace />
  }
  return children;
};

export default Protected;
