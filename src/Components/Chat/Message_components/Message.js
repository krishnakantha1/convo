import React, { useContext } from "react";

import { LoginContext } from "../../../Context/loginContext";

import styles from "../Chat.module.css";

export const Message = ({ message, prevsame }) => {
  const { LoginDetail: { id } } = useContext(LoginContext);
  
  return (
    <div
      className={ id === message.r_user_id ? styles.myMessage : styles.othersMessage }
      id={message.r_message_id}
    >
      <div className={`${styles.messageInner} ${prevsame?styles.sameUser:''}`}>
        {prevsame || id === message.r_user_id ? null : <p className={styles.userName}>{message.r_user_name}</p>}
        <p>{message.r_message_text}</p>
      </div>
    </div>
  );
};
