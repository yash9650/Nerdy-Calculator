import { useContext, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          authCtx.setIsAuthenticated(true);
          authCtx.setUserData(data.result);
          navigate("/");
          toast.success("Login successful");
        }
      })
      .catch((err) => {
        toast.error("Invalid credentials");
      });
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="row">
        <div className="col-md-4 offset-md-4">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="username"
              placeholder="Username"
              className="form-control"
              id="username"
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  username: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              placeholder="Password"
              type="password"
              className="form-control"
              id="password"
              onChange={(e) =>
                setLoginDetails({
                  ...loginDetails,
                  password: e.target.value,
                })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
