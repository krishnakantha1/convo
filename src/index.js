import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";

import { LoginProvider } from "./Context/loginContext";

import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <LoginProvider>
    <App />
  </LoginProvider>
);

//"react-router-dom": "^5.2.0",
