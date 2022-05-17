import React,{useState} from "react";

import styles from "./CSS/ChatControler.module.css";


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

const GroupBadge = ({ group, setDisplayedGroup }) => {
  return (
    <div className={styles.groupBadge}>
      <span className={styles.badge} onClick = {()=>setDisplayedGroup(group)}>
        <p className={styles.badgeText}>{group.group_name[0]}</p>
      </span>
    </div>
  );
};
