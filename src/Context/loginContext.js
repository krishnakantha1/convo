import React, { createContext, useState } from "react";

const loginDetailsInitial = {
  loggedIn: false,
  username: null,
  token: null,
  id: null,
};

export const LoginContext = createContext(loginDetailsInitial);

export const LoginProvider = ({ children }) => {
  const [details, setDetails] = useState(loginDetailsInitial);

  const loggin = (data) => {
    if (!data) return;

    localStorage.setItem("LogDetail", JSON.stringify(data.token));
    
    setDetails({
      loggedIn: true,
      username: data.username,
      token: data.token,
      id: data.id,
    });
  };

  const loggout = () => {
    if (!details.loggedIn) return;
    setDetails(loginDetailsInitial);
    localStorage.removeItem("LogDetail");
  };

  return (
    <LoginContext.Provider value={{ LoginDetail: details, loggin, loggout }}>
      {children}
    </LoginContext.Provider>
  );
};
