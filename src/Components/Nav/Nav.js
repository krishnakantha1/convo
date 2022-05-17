import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import styles from "./Nav.module.css";

import { LoginContext } from "../../Context/loginContext";

export const Nav = () => {
  const [fixed, setFixed] = useState(false);
  const [promptLogout, setPromptOut] = useState(false);
  const [burger, toggleBurger] = useState(false);

  const { LoginDetail, loggout } = useContext(LoginContext);

  useEffect(() => {
    const navPlacemnt = (e) => {
      if (!fixed && window.scrollY > 60) {
        setFixed(true);
      } else if (fixed && window.scrollY < 60) {
        setFixed(false);
      }
    };
    window.addEventListener("scroll", navPlacemnt);

    return () => {
      window.removeEventListener("scroll", navPlacemnt);
    };
  }, [fixed]);

  const doLogout = () => {
    setPromptOut(!promptLogout);
    loggout();
  };

  return (
    <>
      <nav className={`${styles.nav} ${fixed ? styles.navFixed : ""}`}>
        <div className={styles.logo}>
          <h2>CONVO</h2>
        </div>
        <ul className={`${styles.navLinks} ${burger ? styles.navActive : ""}`}>
          <li onClick={() => toggleBurger(!burger)}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
          </li>

          <li onClick={() => toggleBurger(!burger)}>
            <Link to="/chat" className={styles.link}>
              Chat
            </Link>
          </li>

          {LoginDetail.loggedIn ? (
            <li
              onClick={() => {
                setPromptOut(!promptLogout);
                toggleBurger(!burger);
              }}
            >
              Logout
            </li>
          ) : (
            <>
              <li onClick={() => toggleBurger(!burger)}>
                <Link to="/login" className={styles.link}>
                  Login
                </Link>
              </li>
              <li className={styles.join} onClick={() => toggleBurger(!burger)}>
                <Link to="/register" className={styles.link}>
                  Join
                </Link>
              </li>
            </>
          )}
        </ul>
        <div
          className={`${styles.burger} ${burger ? styles.toggle : null}`}
          onClick={() => toggleBurger(!burger)}
        >
          <div className={styles.line1}></div>
          <div className={styles.line2}></div>
          <div className={styles.line3}></div>
        </div>
      </nav>
      {promptLogout && (
        <div
          className={styles.promptBackground}
          onClick={() => setPromptOut(!promptLogout)}
        >
          <div
            className={styles.prompt}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p>Are you sure you want to logout?</p>
            <button onClick={doLogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
};
