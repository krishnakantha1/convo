import React from "react";

import styles from "../CSS/SystemMessage.module.css"

export const SystemMessage = ( { message } )=>{
    return(
        <div className={styles.container}>
            <p className={styles.message}>{message.r_message_text}</p>
        </div>
    )
}