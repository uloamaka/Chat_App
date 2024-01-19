import { Badge, CloseButton } from "@chakra-ui/react";
import React from 'react'

const UserBadgeItem = (user, handleFunction, is_admin, u) => {
  console.log(user);
  console.log("is_admin: " + is_admin);
  return (
    <Badge
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="blue"
      color={"white"}
      cursor={"pointer"}
      onClick={handleFunction}
    >

      {is_admin === user._id ? (
        <span> {user.user.username}</span>
      ) : (
        user.user.username
      )}
      <CloseButton size="sm" />
    </Badge>
  );
};

export default UserBadgeItem