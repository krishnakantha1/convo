import React, { useEffect, useState, useContext, useRef } from "react";
import styles from "./Chat.module.css";
import MessageArea from "./MessageArea";
import { MessageTypeField } from "./MessageTypeField";

import { LoginContext } from "../../Context/loginContext";
import { createToken } from "./helper";
import { Loading } from "./Loading";



export const ChatArea = ({ displayedGroup,socket }) => {
  
  const { LoginDetail: { id } } = useContext(LoginContext);

  //holds the messages for the current displayed group
  const [messageList, setMessageList] = useState([])

  //flag to indicate if new message is sent be me
  const [myNewMessage, setMyNewMessage] = useState(false)

  //flag indicating that previous chat are trying to be fetched
  const [fetchingPreviousChat, setFetchingPreviousChat] = useState(false)

  const [initialChatLoading,setInitialChatLoading] = useState(true)

  /* toggle to disply the button that fetches the previous messages. 
    if no previous chat are avilable, the button will be disabled */  
  const [GPCBToggle, setGPCBToggle] = useState(false)


  //holds the message that is selected for reply
  const [messageToReply, setMessageToReply] = useState({})

  //reference the div that houses the messages.
  const chatArea = useRef()

  //reference the height that was scolled before requesting for previous message. 
  const previousSize = useRef()

  //reference unique string that is sent and received in all socket transaction.
  const gtoken = useRef();


  //scroll to the end when user sends a new message
  useEffect(()=>{
    if(myNewMessage===true){
      chatArea.current.scrollTop = chatArea.current.scrollHeight
      setMyNewMessage(false)
    }
  },[myNewMessage])

  //stay at the same scroll postion when user retrives previous chats for a group
  useEffect(()=>{
    if(fetchingPreviousChat===false){
      chatArea.current.scrollTop = chatArea.current.scrollHeight - previousSize.current;
    }
  },[fetchingPreviousChat])

  

  //Initilizing the socket and other event handlers. also set the clean up.
  useEffect(() => {

    setMessageList([])
    setMessageToReply({})
    setFetchingPreviousChat(false)
    setGPCBToggle(false)
    setInitialChatLoading(true)
    
    //token to determine the response from server is for the right request
    gtoken.current = createToken()

    //get the latest message for the displayed group
    socket.emit("cnvo_get_latest_messages", 
                            {re_gtoken : gtoken.current, group_id : displayedGroup.group_id, user_id : id })

    //handle the latest message
    socket.on("cnvo_latest_messages_of_group", ( rep ) => {
      const {re_gtoken , data} = rep;
      
      if(re_gtoken!==gtoken.current) return;

      setGPCBToggle(true);

      setMyNewMessage(true);

      setInitialChatLoading(false)

      setMessageList((messages) => [...data, ...messages]);
    })

    //handle getting the previous message for a group
    socket.on("cnvo_previous_message_chunks_of_group", ( rep ) => {
      const {re_gtoken , data} = rep;
      
      if(data.length===0) setGPCBToggle(false);
      
      if(re_gtoken!==gtoken.current) return;

      setMessageList((messages) => [...data, ...messages]);
      
      setFetchingPreviousChat(false);
    });

    //handle new messages created by the users
    socket.on("cnvo_new_created_message", (new_message) => {

      if(new_message.length===0){ 
        return
      }

      if(new_message[0].r_user_id===id){
        setMyNewMessage(true)
      }

      setMessageList((messages) =>  [...messages, new_message[0]] )
    });

    //clean up of handlers
    return () => {
      socket.off("cnvo_get_latest_messages");
      socket.off("cnvo_previous_message_chunks_of_group");
      socket.off("cnvo_latest_messages_of_group");
      socket.off("cnvo_new_created_message")
      
      //register the last seen for the user.
      socket.emit("cnvo_user_closed_group", { user_id : id, group_id : displayedGroup.group_id } );
    };
  }, [displayedGroup, id]);

  //Sliding for mobile*******************
  const [slideState, setSlideState] = useState(0);
  var xDown = null;
  var yDown = null;
  function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
  }
  const handleTouchStart = (evt) => {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };
  const handleTouchMove = (evt) => {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        if(slideState===0) setSlideState(1);
        else if(slideState===-1) setSlideState(0);
      } else {
        if(slideState===0) setSlideState(-1);
        else if(slideState===1) setSlideState(0);
      }
    }

    xDown = null;
    yDown = null;
  };
  //************************************* */

  const getPreviousChat = (e) => {
    e.preventDefault();

    if(messageList.length===0) return;
    
    setFetchingPreviousChat(true);
    previousSize.current = chatArea.current.scrollHeight;

    socket.emit("cnvo_get_previous_message_chunks", {
      re_gtoken : gtoken.current,
      user_id : id,
      group_id : displayedGroup.group_id,
      oldest_message_id: (messageList[0].r_message_id === -1 ? messageList[1].r_message_id : messageList[0].r_message_id),
    });
  };

  return (
    <>
      {
        initialChatLoading ?
          <div 
            className={styles.innerChatContainer}
            ref={chatArea}>
            <Loading background_color={'rgb(75, 75, 75)'}/>
          </div>
        :
        <div
          className={`${styles.innerChatContainer} 
          ${slideState===-1 ? styles.rightSlide:""}
          ${slideState===1 ? styles.leftSlide :""}
          `}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}>

          <div className={styles.chatHeading}>
            <h2>{`#${displayedGroup.group_name}`}</h2>
          </div>
          <div className={styles.chatArea}>
            <div ref={chatArea} className={styles.chats}>

              { GPCBToggle && (<GetPreviousChatButton
                getPreviousChat={getPreviousChat}
                fetchingPreviousChat={fetchingPreviousChat}
              />) }

              <MessageArea messageList={ messageList } setMessageToReply={ setMessageToReply }/>

            </div>
            <MessageTypeField
              socket={socket}
              group={displayedGroup}
              messageToReply = { messageToReply }
              setMessageToReply={ setMessageToReply }
            />
          </div>

        </div>
      }
    </>
  );
};
















const GetPreviousChatButton = ({ getPreviousChat, fetchingPreviousChat }) => {
  return (
    <div
      className={`${
        fetchingPreviousChat
          ? styles.gettingPrevious
          : styles.getPreviousChatButton
      }`}
      onClick={getPreviousChat}
    >
      {!fetchingPreviousChat && (
        <div className={styles.previousBtn}>
          <span>˄</span>
        </div>
      )}
      {fetchingPreviousChat && (
        <div className={styles.previousBtn}>
          <span style={{ "--i": "1" }}></span>
          <span style={{ "--i": "2" }}></span>
          <span style={{ "--i": "3" }}></span>
        </div>
      )}
    </div>
  );
};
