import React, { useContext, useState } from "react";

import styles from "./CSS/MessageTypeField.module.css"

import { LoginContext } from "../../Context/loginContext";

export const MessageTypeField = ({ socket, group, messageToReply, setMessageToReply }) => {
  const [message, setMessage] = useState("");

  const { LoginDetail: { id } } = useContext(LoginContext);

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (message.length === 0) return;

    //expected data format in bakend -> { userID,group_id,message_text,replyed_to_message_id }
    socket.emit("cnvo_new_user_message", 
                  { 
                    userID : id,
                    group_id : group.group_id,
                    message_text : message,
                    replyed_to_message_id : messageToReply.r_message_id
                  });

    setMessage("")
    setMessageToReply({})
  };

  const handleInputChange = (e) => {
    if(e.target.value.length > 1000)
      return

    setMessage(e.target.value)
  }

  const removeMessageToReply = (e) => {
    setMessageToReply({})
  }


  return (
    <div className={styles.container}>
      { Object.keys(messageToReply).length>0 && 
            (
              <div className={styles.toReplyMessageContainer}>
                <div className={styles.toReplyMessageBubble}>
                  <p>{ messageToReply.r_user_id===id? "You" : messageToReply.r_user_name }</p>
                  <p>{ messageToReply.r_message_text }</p>
                </div>
                <button type="button" onClick={ removeMessageToReply }>✖</button>
              </div>
            )
        }
      <form className={styles.form} onSubmit={ handleMessageSend } >
        <div className={styles.textFieldWrapper}>
          <input
          className={styles.textArea}
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message here..."
          />
          <p className={styles.textLength}>{message.length}/1000</p>
        </div>
        <input className={styles.submit} type="submit" value="send" />
      </form>
    </div>
  );
};
