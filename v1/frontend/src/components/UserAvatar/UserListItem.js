import { Avatar, Box, Text, Flex } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({user, handleFunction }) => {
  return (
    <Flex
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.pic}
      ></Avatar>
      <Box>
        <Text>{user.username}</Text>
        <Text fontSize="xs">
          <b>Email : {user.email}</b>
        </Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
