import React,{useState,useContext,useEffect} from 'react'

import styles from "./CSS/GroupManagement.module.css";

import { LoginContext } from "../../Context/loginContext";


const GroupManagement = ( { setDisplayedGroup, setGroups, socket, setGroupToggle } ) => {

    const { LoginDetail : { id } } = useContext(LoginContext);

    const [createG, setCreateG] = useState("")
    const [groupAbout, setGroupAbout] = useState("")
    const [joinG, setJoinG] = useState("")

    useEffect(()=>{
        socket.on("cnvo_join_group_success",data => {
            const { group_data } = data 
            setGroupToggle(false);
            setGroups(groups => ( { ...groups, [ group_data.group_id ] : group_data } ) );
            setDisplayedGroup(group_data);
        });

        socket.on("cnvo_join_group_error",(data) =>{ 
            setGroupToggle(false);
            console.log(data);
        });

        socket.on("cnvo_create_group_success", data => {
            const { group_data } = data 
            setGroupToggle(false);
            setGroups(groups => ( { [ group_data.group_id ] : group_data, ...groups,  } ) );
            setDisplayedGroup(group_data);
        });

        socket.on("cnvo_create_group_error",(data)=>{
            setGroupToggle(false);
            console.log(data);
        });

        return ()=>{
            socket.off("cnvo_join_group_success")
            socket.off("cnvo_join_group_error")
            socket.off("cnvo_create_group_success")
            socket.off("cnvo_create_group_error")
        }
    })

    

    //Request to create a new group.
    const createGroup = (e)=>{
        e.preventDefault();
        if(createG.length===0) return;

        socket.emit("cnvo_create_group_for_user",{ userID : id, group_name : createG, group_about : groupAbout });
    }

    const joinGroup = (e)=>{
        e.preventDefault();
        if(joinG.length===0) return;

        socket.emit("cnvo_join_group_for_user",{ userID : id, group_id :joinG });
    }
    
    return (
        <div className={styles.container} onClick={() => setGroupToggle(value => !value)}>
            <div className={styles.formContainer} onClick={(e)=>e.stopPropagation()}>
                <form onSubmit={createGroup}>
                    <label>Create a new Group:</label>
                    <div className={styles.inputContainer}>
                        <input type="text" onChange={(e)=> setCreateG(e.target.value)} placeholder="Group Name"/>
                        <textarea placeholder="What is this group about??"
                            value={groupAbout}
                            onChange={(e)=> setGroupAbout(e.target.value)}/>
                        <input type="submit" value="Create"/>
                    </div>     
                </form>
                <form onSubmit={joinGroup}>
                    <label>Join a group:</label>
                    <div className={styles.inputContainer}>
                        <input type="text" onChange={(e)=> setJoinG(e.target.value)} placeholder="Group Code"/>
                        <input type="submit" value="Join"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GroupManagement
