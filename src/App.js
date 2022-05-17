import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import axios from "axios";

import { Nav } from "./Components/Nav/Nav";
import { Home } from "./Components/Home/Home";
import { Chat } from "./Components/Chat/Chat";
import { LogReg } from "./Components/LogReg/LogReg";
import { LoginContext } from "./Context/loginContext";
import AuthCheck from './Components/Loadings/AuthCheck';
//"http://localhost:4000"
export const host = "https://backend-convo.herokuapp.com"

export const App = () => {
  const [verifyToken, setVerifyToken] = useState(true);

  const { loggin } = useContext(LoginContext);

  useEffect(() => {
    alwaysLogin();
  }, []);

  const alwaysLogin = async () => {
    if (localStorage.getItem("LogDetail") !== null) {
      const token = JSON.parse(localStorage.getItem("LogDetail"));
      const {
        data: { data, error, message, deleteToken },
      } = await axios({
        method: "POST",
        url: `${host}/users/login-with-jwt`,
        data: { token },
      });
      if (error) {
        console.log(message);
        setVerifyToken(false);
        if (deleteToken) localStorage.removeItem("LogDetail");
      } else {
        loggin(data);
        setVerifyToken(false);
      }
    } else {
      setVerifyToken(false);
    }
  };
  return (
    <>
      {verifyToken ? (
        <AuthCheck/>
      ) : (
        <Router>
          <Nav />
          <Routes>
            <Route path="/" exact element={<Home/>}></Route>
            <Route path="/chat" exact element={<Chat/>}></Route>
            <Route
              path="/login"
              exact
              element={<LogReg isLogin={true}/>}
            ></Route>
            <Route
              path="/register"
              exact
              element={<LogReg isLogin={false} />}
            ></Route>
          </Routes>
        </Router>
      )}
    </>
  );
};
