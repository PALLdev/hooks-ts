import React from "react";
import Card from "./UI/Card";
import "./Auth.css";

const Auth: React.FC = (props) => {
  const loginHandler = () => {};

  return (
    <div>
      <Card>
        <h2>No estas autenticado!</h2>
        <p>Debes logearte para continuar.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;
