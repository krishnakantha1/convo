import React from "react"

import { StandardMessage } from "./Message_components/StandardMessage"
import { SystemMessage } from "./Message_components/SystemMessage"

const MessageArea = ({ messageList, setMessageToReply }) => {
  
  var prev = "";

  return (
    <>
      {
      messageList.map( message =>{
        var prevsame = false;
        if(prev===message.r_user_name) prevsame = true;
        else prev = message.r_user_name===null ? '*' : message.r_user_name;
        
        if(message.r_message_type==="SYS"){
          return <SystemMessage key={ message.r_message_id } message={ message } />
        }else{
          return <StandardMessage 
                    key={ message.r_message_id } 
                    message={message}
                    setMessageToReply={setMessageToReply}  
                    prev_message_from_same_user={ prevsame }/>
        }
        
      })}
    </>
  );
};

export default React.memo(MessageArea);
