import React, { useContext } from "react";
import Card from "./UI/Card";
import "./Auth.css";
import { AuthContext } from "../context/auth-context";

const Auth: React.FC = (props) => {
  const authCtx = useContext(AuthContext);
  const loginHandler = () => authCtx.login();

  return (
    <div className="auth">
      <Card>
        <h2>No estas autenticado!</h2>
        <p>Debes logearte para continuar.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;
