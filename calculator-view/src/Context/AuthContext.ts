import { createContext } from "react";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userData: any;
  setUserData: (userData: any) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  setIsAuthenticated: (ticket: any) => {},
  userData: null,
  setUserData: (userData: any) => {},
  logout: () => {},
});

export default AuthContext;
