import React, { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import Auth from "./components/Auth";
import Ingredients from "./components/Ingredients/Ingredients";

const App: React.FC = (props) => {
  const authCtx = useContext(AuthContext);
  let content = <Auth />;

  if (authCtx.isAuth) {
    content = <Ingredients />;
  }

  // return !authCtx.isAuth ? <Auth /> : <Ingredients />;  // otra forma de hacer lo mismo
  return content;
};

export default App;
