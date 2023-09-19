import { createContext } from "react";
import { IUser } from "../Interfaces/common.interface";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userData: IUser | null;
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
