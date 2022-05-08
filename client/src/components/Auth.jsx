import { useState } from "react";
import jwt from "jwt-decode";
import useAuth from "hooks/useAuth";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { fakeAuthProvider } from "helpers/auth";
import AuthContext from "context/AuthContext";
import api from "api/api";

export function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  const token = localStorage.getItem("token");
  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AuthProvider({ children }) {
  let [user, setUser] = useState(null);

  let signin = (user, callback) => {
    return api
      .post("/api/auth/login", user)
      .then(({ data }) => {
        setUser(data?.user);
        api.defaults.headers.common = {
          Authorization: `Bearer ${data?.token}`,
        };
        localStorage.setItem("token", data?.token);
        const decodedToken = jwt(data?.token);
        localStorage.setItem("userId", decodedToken?.user?._id);
        callback();
      })
      .catch(() => {
        callback(true);
      });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}
