import React from "react";

import styles from "./CSS/Loading.module.css"

export const Loading = ( { background_color } ) => {
    if(!background_color){
        background_color = 'black'
    }

    return (
        <div style={{
                backgroundColor : background_color
            }} className={styles.container}>

            <div className={styles.blinker}>
                <span style={{ "--i": "1" }} ></span>
                <span style={{ "--i": "2" }}></span>
                <span style={{ "--i": "3"}}></span>
            </div>

        </div>
    )
}