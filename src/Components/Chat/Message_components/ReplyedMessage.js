import React from "react"

import styles from "../CSS/ReplyedMessage.module.css"

export const ReplyedMessage = ( { r_username, r_message_text } )=>{
    return(
        <div className={styles.container}>
            <p className={styles.name}>{ r_username }</p>
            <p className={styles.message}>{ r_message_text }</p>
        </div>
    )
}