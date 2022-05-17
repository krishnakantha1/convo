import React, { useState, useContext } from "react";
import axios from "axios";
import styles from "./LogReg.module.css";
import { LoginContext } from "../../Context/loginContext";

import {host } from "../../App"

export const Register = ({ toggle }) => {
  const { loggin } = useContext(LoginContext);
  const [credential, setCredential] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

  //flags
  const [error, setError] = useState({ error: false, message: "" });
  const [fetching, setFetching] = useState(false);

  const formValidate = () => {
    for (let key in credential) {
      if (credential[key].length === 0) {
        return [true, "Please fill in your credientials."];
      }
    }

    if (credential.password.length < 10)
      return [true, "password must be at least 10 charecters."];
    else if (/[A-Z]/.test(credential.password) === false)
      return [true, "password must contain upper case letter."];
    else if (credential.password !== credential.repassword)
      return [true, "passwords must match."];

    return [false, ""];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [validateError, validateMessage] = formValidate();

    if (validateError) {
      setError({ error: true, message: validateMessage });
      return;
    }
    setFetching(true);
    const { data: { data, error, message } } = await axios({
      url: `${host}/users/register`,
      method: "POST",
      data: {
        username: credential.username,
        email: credential.email,
        password: credential.password
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

  const handleOnchange = (e) => {
    if (error.error) setError({ error: false, message: "" });
    const { name, value } = e.target;
    setCredential({ ...credential, [name]: value });
  };

  return (
    <div className={styles.innerContainer}>
      <form onSubmit={handleSubmit}>
        <div className={fetching ? styles.loader : styles.displayOff}></div>
        <h1>Shadow Clan</h1>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={credential.username}
          onChange={handleOnchange}
        ></input>
        <input
          type="email"
          placeholder="email"
          name="email"
          value={credential.email}
          onChange={handleOnchange}
        ></input>
        <input
          type="password"
          placeholder="password"
          name="password"
          value={credential.password}
          onChange={handleOnchange}
        ></input>
        <input
          type="password"
          placeholder="re-enter password"
          name="repassword"
          value={credential.repassword}
          onChange={handleOnchange}
        ></input>
        <input
          type="submit"
          value="Register"
          disabled={fetching ? true : false}
        ></input>
        <p className={error.error ? styles.danger : styles.displayOff}>
          {error.message}
        </p>
        <p>have an account?? well... just login!</p>
        <button
          value="Login"
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};
