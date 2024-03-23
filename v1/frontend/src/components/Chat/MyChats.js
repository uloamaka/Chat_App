import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../miscellaneous/ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const chatResponse = await axios.get("/api/v1/chat", config);
      const groupResponse = await axios.get("/api/v1/group-chat", config);

      let chats = [...chatResponse.data.data, ...groupResponse.data.data];
      setChats(chats);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  //   useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   fetchChats();
  // }, [fetchAgain, setLoggedUser, fetchChats]);

  return (
    <Flex
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <Flex
        pb={3}
        px={3}
        fontSize={{ base: "16px", md: "20px", lg: "28px", xl: "30px" }}
        fontFamily="Work Sans"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        borderBottom="1px solid #ccc"
      >
        <Text>Chats</Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "14px", md: "16px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="blue"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>

      <Flex
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" spacing={2}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                transition="background-color 0.3s"
                _hover={{
                  bg: selectedChat === chat ? "#38B2AC" : "#C0C0C0",
                }}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.participants)
                    : chat.name}
                </Text>
                {/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Flex>
    </Flex>
  );
};

export default MyChats;
