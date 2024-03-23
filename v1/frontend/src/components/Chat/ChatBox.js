import React from 'react'
import {ChatState} from "../../Context/ChatProvider"
import { Flex } from "@chakra-ui/react"
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat}  = ChatState()
  return (
    <Flex
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      padding={3}
      background="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Flex>
  );
}

export default ChatBox