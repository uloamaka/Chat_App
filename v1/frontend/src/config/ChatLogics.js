export const getSender = (loggedUser, participants) => {
  return participants[1]._id === loggedUser._id
    ? participants[0].username
    : participants[1].username;
};

export const getSenderFull = (loggedUser, participants) => {
  return participants[1]._id === loggedUser._id
    ? participants[0]
    : participants[1];
};

export const isSameSenderMargin = (messages, m, i, user) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== user.data.data.user._id
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== user.data.data.user._id) ||
    (i === messages.length - 1 &&
      messages[i].sender._id !== user.data.data.user._id)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, user) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== user.data.data.user._id
  );
};

export const isLastMessage = (messages, i, user) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== user.data.data.user._id &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i].sender._id === m.sender._id;
};
 
export const isMessageFromCurrentUser = (message, user) => {
 return message.sender._id === user.data.data.user._id;
};
