import React, { useState } from "react";

type AuthContextObj = {
  isAuth: boolean;
  login: () => void;
};

export const AuthContext = React.createContext<AuthContextObj>({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider: React.FC = (props) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const loginHandler = () => setLoginStatus(true);

  const contextValue: AuthContextObj = {
    isAuth: loginStatus,
    login: loginHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
