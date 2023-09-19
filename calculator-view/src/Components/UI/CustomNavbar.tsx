import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

export const CustomNavbar = () => {
  const ctx = useContext(AuthContext);

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-md bg-dark navbar-dark sticky-top">
        <Link className="navbar-brand" to="/">
          Nerdy Calculator
        </Link>
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navb"
          aria-expanded="true"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navb" className="navbar-collapse collapse hide">
          <ul className="navbar-nav">
            {ctx.isAuthenticated && (
              <li className="nav-item active">
                <Link className="nav-link" to="/calculator">
                  Calculator
                </Link>
              </li>
            )}
          </ul>

          <ul className="nav navbar-nav mr-auto">
            {ctx.isAuthenticated && ctx.userData ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>{" "}
                    {ctx.userData.username.toUpperCase()}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    role="button"
                    onClick={ctx.logout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-box-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login/Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <div className="app-container">
        <Outlet />
      </div>
    </React.Fragment>
  );
};
