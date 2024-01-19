import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isMessageFromCurrentUser,
} from "../../config/ChatLogics";
import { ChatState } from '../../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {isSameSender(messages, m, i, user) && (
              <Tooltip
                label={m.sender.username}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  label={m.sender.username}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: isMessageFromCurrentUser(m, user)
                  ? "#B9F5D0"
                  : "#dededc",
                marginLeft: isSameSenderMargin(messages, m, i, user),
                marginTop: isSameUser(messages, m, i, user) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat
 