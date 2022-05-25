import React from "react";

import styles from "./CSS/GroupBadge.module.css"

export const GroupBadge = ({ group, setDisplayedGroup })=>{

    return (
    <div className={styles.container}>
        <div className={styles.badgeContainer}>
            <span className={styles.badge} onClick = {()=>setDisplayedGroup(group)}>
            <p className={styles.badgeText}>{group.group_name[0]}</p>
            </span>
        </div>
        <div className={styles.nameContainer}>
            <div className={styles.badgeName}>
                <div className={styles.toolTip}>
                    <p>{group.group_name}</p>
                </div>
            </div>
        </div>
    </div>
    )
}