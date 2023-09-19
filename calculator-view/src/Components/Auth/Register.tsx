import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../../Context/AuthContext";

export const Register: React.FC<{
  hideRegister: () => void;
}> = (props) => {
  const [registerState, setRegisterState] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [hidePassword, setHidePassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterState({
      ...registerState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerState),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRegisterState({
            name: "",
            email: "",
            username: "",
            password: "",
          });
          toast.success("Account created successfully!");
          authContext.setIsAuthenticated(true);
          authContext.setUserData(data.result);
          navigate("/calculator", { replace: true });
        } else {
          toast.error(data.errorMessage);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container my-2">
      <h5>Register</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-2">
          <label htmlFor="name" className="text-start d-block">
            Name
          </label>
          <input
            type="name"
            placeholder="Your Name"
            className="form-control"
            id="name"
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="email" className="text-start d-block">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            id="email"
            name="email"
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="register-username" className="text-start d-block">
            Username
          </label>
          <input
            type="username"
            placeholder="Username"
            className="form-control"
            id="register-username"
            name="username"
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="register-password" className="text-start d-block">
            Password
          </label>
          <input
            placeholder="Password"
            type={hidePassword ? "password" : "text"}
            className="form-control"
            id="register-password"
            name="password"
            onChange={handleChange}
          />
          <div className="text-start small">
            <input
              type="checkbox"
              id="showPassword"
              onChange={(e) => {
                setHidePassword((old) => !old);
              }}
            />
            <label htmlFor="showPassword" className="ms-1" role="button">
              Show Password
            </label>
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </form>
      <p className="text-primary" role="button" onClick={props.hideRegister}>
        Already have an account?
      </p>
    </div>
  );
};
