import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Flex } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/Chat/ChatBox";
import MyChats from "../components/Chat/MyChats";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Flex
        direction="row" 
        w="100%"
        h="91.5vh"
        p="10px"
        justify="space-between"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain}  />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </div>
  );
};

export default ChatPage;
