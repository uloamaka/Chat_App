import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
  Flex,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [groupStatus, setGroupStatus] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedContacts, SetselectedContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.get(
        `/api/v1/user?search=${search}`,
        {
          withCredentials: true,
        },
        config
      );
      setLoading(false);
      setSearchResult(data.data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: `Failed to load the Search Results`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName) {
      toast({
        title: "Provide Group Name!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!selectedContacts) {
      toast({
        title: "Provide Group Members!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("name", groupChatName);
      formData.append("status", groupStatus);
      formData.append(
        "members",
        JSON.stringify(selectedContacts.map((u) => u._id))
      );

      const { data } = await axios.post(`/api/v1/group-chat`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data)
      setLoading(false);
      setChats([data.data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error occured!",
        description: `Failed to create Group chat`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleDelete = (delUser) => {
    SetselectedContacts(
      selectedContacts.filter((sel) => sel._id !== delUser._id)
    );
  };
  const handleGroup = (contactsToAdd) => {
    if (selectedContacts.includes(contactsToAdd)) {
      toast({
        title: "User already added!",
        description: `Failed to load the Search Results`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    SetselectedContacts([...selectedContacts, contactsToAdd]);
  };

  const handleImage = (image) => {
    setSelectedImage(image);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <FormLabel>Group Icon</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e.target.files[0])}
              />
              <FormHelperText mb={3}>
                Select an image file for the group icon.(optional)
              </FormHelperText>
            </FormControl>
            <FormControl>
              {/* <FormLabel>Group Name</FormLabel> */}
              <Input
                placeholder="Enter Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              {/* <FormLabel>Group Status</FormLabel> */}
              <Input
                placeholder="Enter Group description"
                mb={3}
                onChange={(e) => setGroupStatus(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              {/* <FormLabel>Group Participants</FormLabel> */}
              <Input
                placeholder="Add participants eg: John Duo, Yanis..."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            {/* <Flex w="100%" flexWrap={"wrap"}>
              {selectedContacts.map((u) => {
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />;
              })}
            </Flex> */}
            <Flex w="100%" flexWrap="wrap">
              {selectedContacts.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Flex>
            {loading ? (
              <div>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
