import React, { useState, useContext } from "react";
import axios from "axios";

import styles from "./LogReg.module.css";
import { LoginContext } from "../../Context/loginContext";

import {host} from "../../App"

const initialState = { email: "", password: "" };

export const Login = ({ toggle }) => {
  //user credientials for login.
  const [credential, setCredential] = useState(initialState);

  //flags
  const [error, setError] = useState({ error: false, message: "" });
  const [fetching, setFetching] = useState(false);

  //this is the function for setting context value on login.
  const { loggin } = useContext(LoginContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credential.email.length === 0 || credential.password.length === 0) {
      setError({ error: true, message: "Please fill in your credientials." });
      return;
    }

    setFetching(true);
    const {data: { error, data, message }} = await axios({
      method: "POST",
      url: `${host}/users/login`,
      data: {
        email: credential.email,
        password: credential.password,
      },
    });
    if (!error) {
      loggin(data);
    } else {
      setError({
        error: true,
        message: message,
      });
      setFetching(false);
    }
  };

  const onchange = (e) => {
    if (error.error) setError({ error: false, message: "" });
    const { name, value } = e.target;
    setCredential({ ...credential, [name]: value });
  };

  return (
    <>
      <div className={styles.innerContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={fetching ? styles.loader : styles.displayOff}></div>
          <h1>Shadow Clan</h1>
          <input
            className={styles.textField}
            type="email"
            value={credential.email}
            onChange={onchange}
            name="email"
            placeholder="Email"
          ></input>
          <input
            className={styles.textField}
            type="password"
            value={credential.password}
            onChange={onchange}
            name="password"
            placeholder="Password"
          ></input>

          <input
            className={styles.submitBtn}
            type="submit"
            value="Login"
            disabled={fetching ? true : false}
          ></input>
          <p className={error.error ? styles.danger : styles.displayOff}>
            {error.message}
          </p>
          <p>Dont have an account?? well... just register!</p>
          <button
            value="Register"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};
