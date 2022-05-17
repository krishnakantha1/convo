import React, { useContext } from "react";
import styles from "./LogReg.module.css";
import { LoginContext } from "../../Context/loginContext";

export const LoggedIn = () => {
  const {
    LoginDetail: { username },
  } = useContext(LoginContext);
  return (
    <div className={styles.innerContainer}>
      <h2>You are logged in as {username}</h2>
    </div>
  );
};
