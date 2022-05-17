import React,{ useContext, useEffect, useRef, useState } from 'react'
import styles from "./CSS/Members.module.css";
import { createToken } from "./helper";
import { Loading } from './Loading';

import { LoginContext } from "../../Context/loginContext"

export const Members = ( { socket , group } ) => {

    const { LoginDetail : { id } } = useContext(LoginContext)

    //holds the list of members
    const [members,setMembers] = useState({});

    //flag to indeicate waiting for responce from server
    const [fetchingMembers,setFetchingMembers] = useState(true)

    const mtoken = useRef();

    

    useEffect(() => {
        //setMembers({});
        setFetchingMembers(true)

        mtoken.current = createToken();

        socket.emit("cnvo_get_members_for_group",{ r_token : mtoken.current, group_id : group.group_id } );

        socket.on("cnvo_all_members_of_group",(data)=>{
            const { r_token, r_members } = data;

            if(r_token!==mtoken.current) 
                return

            let create_members = {};
            r_members.forEach( member =>{
                create_members[member.r_user_id] = member;
            })
            
            setMembers(create_members);
            setFetchingMembers(false)
        })

        socket.on("cnvo_user_online",(data)=>{

            const { r_group, r_data } = data

            if(r_group!==group.group_id)
                return;
            
            setMembers((prev)=> {

                return {...prev, [r_data.r_user_id] : r_data};
            })
        })

        socket.on("cnvo_user_offline",(data)=>{
            const { r_group, r_user_id } = data

            if(r_group!==group.group_id)
                return;

            setMembers((prev)=> {
                
                const user = prev[r_user_id]
        
                user.r_status = false

                return { ...prev, [ r_user_id ] : user };
            })
        })

        socket.on("cnvo_user_left",(data)=>{
            const { r_group, r_user_id } = data

            if(r_group!==group.group_id)
                return;

            setMembers((prev)=> {
                const temp = {...prev}
                delete temp[r_user_id]
                return {...temp}
            })
        })

        return () =>{
            socket.off("cnvo_all_members_of_group");
            socket.off("cnvo_user_online");
            socket.off("cnvo_user_offline");
            socket.off("cnvo_user_left")
        }
    }, [ group, socket ] )


    const copy=(e)=>{
        const temp = document.createElement("input");
        temp.style.position='absolute';
        temp.value = group.group_id;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }

    const leaveGroup = (e)=>{
        socket.emit("cnvo_user_leave_group", { userID : id , groupID : group.group_id })
    }


    return (
        <>
        {
            fetchingMembers ?
            <div className={styles.container}>
                <Loading/>
            </div>
            :
            (<div className={styles.container}>

                <header>
                    <h2>Members</h2>
                </header>

                <div className={styles.members}>
                    { Object.keys(members).some((key) => members[key].r_status ) && <p className={styles.status}>Online</p>}
                    <div className={styles.onlineContainer}>
                    {
                        Object.keys(members).map((key) =>{
                            const member = members[key]
                            if(members[key].r_status) 
                                return (
                                    <div key={key} className={styles.member}>
                                        <span className={styles.onlineTag}></span>
                                        <p>{member.r_user_name}</p>
                                    </div>
                                )
                            return null
                        })
                    }
                    </div>
                    
                    { Object.keys(members).some((key) => !members[key].r_status ) && <p className={styles.status}>Offline</p>}
                    <div className={styles.offlineContainer}>
                    {
                        Object.keys(members).map((key) =>{
                            const member = members[key]
                            if(!members[key].r_status) 
                                return (
                                    <div key={key} className={styles.member}>
                                        <span className={styles.offlineTag}></span>
                                        <p>{member.r_user_name}</p>
                                    </div>
                                )
                                return null
                        })
                    }
                    </div>
                </div>

                <footer>
                    <div className={styles.copy}>
                        <p>Copy Group Code</p> 
                        <button type='button' title="copy group code" onClick={()=>copy()}>COPY</button>
                    </div>
                    <div className={styles.leave} onClick={leaveGroup}>
                        <p>Leave Group</p>
                        <span>⍈</span>
                    </div>
                </footer>
            </div>
            )
            }
        </>
    )
}
