import React, { useContext, useState, useEffect } from "react";

import { Login } from "./Login";
import { Register } from "./Register";
import { LoggedIn } from "./LoggedIn";

import styles from "./LogReg.module.css";

import { LoginContext } from "../../Context/loginContext";

export const LogReg = ({ isLogin }) => {
  const { LoginDetail } = useContext(LoginContext);

  //to toggle between login and register component.
  const [login, setLogin] = useState(isLogin);

  useEffect(() => {
    setLogin(isLogin);
  }, [isLogin]);

  const toggle = () => {
    setLogin(!login);
  };

  return (
    <div className={styles.container}>
      <div className={styles.arc}></div>
      {LoginDetail.loggedIn ? (
        <LoggedIn />
      ) : login ? (
        <Login toggle={toggle} />
      ) : (
        <Register toggle={toggle} />
      )}
    </div>
  );
};
