import { useContext, useEffect, useState } from "react";
import { Login } from "./Login";
import "./login-register-page.css";
import { Register } from "./Register";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginRegisterPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.isAuthenticated) {
      navigate("/calculator", { replace: true });
    }
  }, []);

  return (
    <div className="login-register-page-container">
      <div className="flip-card">
        <div
          className={`${showLogin ? "" : "flip-card-rotate"} flip-card-inner`}
        >
          <div className="flip-card-front">
            <Login
              hideLogin={() => {
                setShowLogin(false);
              }}
            />
          </div>
          <div className="flip-card-back">
            <Register
              hideRegister={() => {
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
