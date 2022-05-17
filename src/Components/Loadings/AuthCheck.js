import React from 'react'

import styles from "./AuthCheck.module.css";

const AuthCheck = () => {
    const name=["C","O","N","V","O"];
    return (
        <div className={styles.container}>
            <div>
                {name.map((letter,i)=><h1 key={i} style={{"--i":i}}>{letter}</h1>)}
            </div>
            <p>Authentication In Progress . . . . 
            </p>
        </div>
    )
}

export default AuthCheck
