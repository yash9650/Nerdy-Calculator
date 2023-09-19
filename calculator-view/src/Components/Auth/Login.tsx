import { useContext, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Login: React.FC<{
  hideLogin: () => void;
}> = (props) => {
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
          navigate("/", { replace: true });
          toast.success("Login successful");
        }
      })
      .catch((err) => {
        toast.error("Invalid credentials");
      });
  };

  return (
    <div className="container my-2">
      <h5>Login</h5>
      <form onSubmit={onSubmit}>
        <div className="form-group my-2">
          <label htmlFor="username" className="text-start d-block">
            Username
          </label>
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
        <div className="form-group my-2">
          <label htmlFor="password" className="text-start d-block">
            Password
          </label>
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
        <div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <p className="text-primary" role="button" onClick={props.hideLogin}>
        Create a new account
      </p>
    </div>
  );
};
