import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CustomNavbar } from "./Components/UI/CustomNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calculator from "./Components/Calculator";
import { Login } from "./Components/Login";
import AuthContext from "./Context/AuthContext";
import { ProtectedRoute } from "./Components/Auth/ProtectedRoute";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <CustomNavbar />,
      children: [
        {
          index: true,
          element: (
            <div className="container">
              <h2>Welcome to the Nerdy Calculator!</h2>
            </div>
          ),
        },
        {
          path: "/calculator",
          element: (
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

  useEffect(() => {
    fetch("/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true);
          setUserData(data.result);
        }
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setUserData(null);
      });
  }, []);

  const logout = () => {
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .finally(() => {
        setIsAuthenticated(false);
        setUserData(null);
      });
  };

  return (
    <React.Fragment>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          userData,
          setUserData,
          logout,
        }}
      >
        <ToastContainer />
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;
