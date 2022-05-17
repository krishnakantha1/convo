import React, { useContext } from "react"

import { ReplyedMessage } from "./ReplyedMessage"

import styles from "../CSS/StandardMessage.module.css"

import { LoginContext } from "../../../Context/loginContext"

export const StandardMessage = ( { message, prev_message_from_same_user, setMessageToReply } )=>{
    const { LoginDetail : { id } } = useContext(LoginContext)

    const dateFormater = (timestamp)=>{
        const date = []
        
        date.push(timestamp.getDate())
        date.push(timestamp.getMonth()+1)
        date.push(timestamp.getFullYear())

        const time = []
        time.push(timestamp.getHours()%12)
        time.push(":")
        time.push(timestamp.getMinutes())
        time.push(" ")
        time.push(timestamp.getHours()>=12?"PM":"AM")
        return date.join("/")+" "+time.join("")
    }

    const handleReplyIntent = (e)=>{
        setMessageToReply(message)
    }

    return (
        <div className={`${styles.container} ${message.r_user_id===id?styles.myMessage:""}`}>
            <div className={`${styles.messageBubble} ${prev_message_from_same_user?styles.prevMessagFromSameUser:""}`}>
                { 
                    prev_message_from_same_user || id===message.r_user_id ? null : (<p className={styles.userName}>{message.r_user_name}</p>) 
                }
                {
                    message.r_message_type!=="RPLY" ? null : <ReplyedMessage 
                                                                    r_username={id===message.r_user_id ? "You" : message.r_replyed_message_username} 
                                                                    r_message_text={message.r_replyed_message_text}/>
                }
                <p className={styles.message}>{message.r_message_text}</p>
                <div className={styles.messageFooter}>
                    {
                        id===message.r_user_id?
                        (
                            <>
                                <button type="button" onClick={handleReplyIntent}>⮑</button>
                                <p>{ dateFormater(new Date(message.r_message_created_on)) }</p>
                            </>
                        ):(
                            <>
                                <p>{ dateFormater(new Date(message.r_message_created_on)) }</p>
                                <button type="button" onClick={handleReplyIntent}>⮐</button>
                            </>
                        )

                    }
                </div>
            </div>
        </div>
    )
}