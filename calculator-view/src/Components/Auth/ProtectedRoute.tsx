import React, { useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const ctx = useContext(AuthContext);

  return ctx.isAuthenticated ? (
    <React.Fragment>{props.children}</React.Fragment>
  ) : (
    <Navigate replace to="/login" />
  );
};
