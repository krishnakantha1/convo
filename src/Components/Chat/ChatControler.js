import React,{useState} from "react";

import styles from "./CSS/ChatControler.module.css";

import { GroupBadge } from "./GroupBadge";


export const ChatControler = ({ groups, setDisplayedGroup, setGroupToggle }) => {

  return (
    <div className={styles.chatControler}>
      {
        Object.keys(groups).map((key,i)=>(
          <GroupBadge group={groups[key]} key={i} setDisplayedGroup={setDisplayedGroup}/>
        ))
      }
      <div className={styles.groupBadge}>
        <span className={styles.addBadge} onClick={()=> setGroupToggle((value)=>!value)}>
          <p className={styles.badgeText}>+</p>
        </span>
      </div>
    </div>
  );
};

