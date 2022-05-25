import React, { useContext, useState, useEffect } from "react";

import styles from "./CSS/Chat.module.css";

import { ChatControler } from "./ChatControler";
import { ChatArea } from "./ChatArea";
import { Members } from "./Members";

import { LoginContext } from "../../Context/loginContext";
import { host } from "../../App"

import socketIOClient from "socket.io-client";
import GroupManagement from "./GroupManagement";
import { Loading } from "./Loading";


let socket;

export const Chat = () => {
  const { LoginDetail : { loggedIn, id } } = useContext(LoginContext);

  const [chatLoad,setChatLoad] = useState(true);
  const [MGTgroupToggle,setGroupToggle] = useState(false);
 
  const [displayedGroup,setDisplayedGroup] = useState({});
  const [groups, setGroups] = useState({});

  const [groupChange,setGroupChange] = useState(false)

  const getGroup = async ()=>{

      try{
        socket = socketIOClient(`${host}`,{ query : `user_id=${id}` });

        socket.emit("cnvo_get_groups_for_user",{userID:id});

        socket.on("cnvo_user_groups", data => {
          /*
            data-> group_list : [{group_id,group_name,about},....]
          */
          const { group_list } = data;
          const group_map = {}

          group_list.forEach(group => {
            group_map[group.group_id] = group;
          });

          setGroups(group_map);
          setChatLoad(false);
          setGroupChange(true)
        });


        socket.on("cnvo_self_left_group",(data)=> {
          const { r_group } = data;

          setGroups((prev)=> {
            const temp = {...prev}
            delete temp[r_group]

            setGroupChange(true)
            return {...temp}
          })

        })

        socket.on("cnvo_error", data => console.log(data));
      }catch(e){
        console.error(e)
      }
      
  }

  useEffect(() => {

    getGroup();

    return () => {
      socket.disconnect();
    }
  },[]);


  useEffect(() => {
    if(groupChange){
      if(Object.keys(groups).length===0) 
        setDisplayedGroup({});
      else 
        setDisplayedGroup(groups[Object.keys(groups)[0]]);

      setGroupChange(false)
    }
    
  },[groupChange])


  return (
    <div className={styles.chatContainer}>
      { loggedIn ? 
        chatLoad ? (
          <div className={styles.LoaderContainer}>
             <Loading background_color = {'black'}/>
          </div>
         
        ) : (
        <>
          <ChatControler groups={groups} setDisplayedGroup={setDisplayedGroup} socket={socket} setGroupToggle={setGroupToggle}/>
          {Object.keys(displayedGroup).length!==0 && (
            <>
            <ChatArea displayedGroup={displayedGroup} socket={socket} />
            <Members group={displayedGroup} socket={socket} />
            </>
          )}
          {Object.keys(displayedGroup).length===0 && (<JoinOrCreateGroupPrompt/>)}
          {MGTgroupToggle && <GroupManagement 
                                setDisplayedGroup={setDisplayedGroup} 
                                setGroups={setGroups} 
                                setGroupToggle={setGroupToggle} 
                                socket={socket}/>}
          
        </>
      ) : (
        <NotLoggedIn />
      )}
    </div>
  );
};

function NotLoggedIn() {
  return (
    <div className={styles.notLoggedIn}>
      <h1>Please log in to use the chat feature!</h1>
    </div>
  );
}



function JoinOrCreateGroupPrompt(){
  const containerStyle = {
    width:'100%',
    height:'90vh',
    'background-color':'black',
    display:'flex',
    'flex-direction':'column',
    'align-items':'center',
    'justify-content':'center',
    position:'absolute',
    transition: 'all ease-in-out 0.5s',
  }

  //Sliding for mobile*******************
  const [slide, setSlide] = useState(false);
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
        if (slide) setSlide(false);
      } else {
        if (!slide) setSlide(true);
      }
    }

    xDown = null;
    yDown = null;
  };
  //************************************* */

  return (
    <div className={`${styles.xyz} ${slide ? styles.slide : ""}`} 
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    >
      <p>You Arent In Any Group.</p>
      <p>Join Or Create A Group By Pressing The '+' Icon On The Left</p>
    </div>
  )
}
