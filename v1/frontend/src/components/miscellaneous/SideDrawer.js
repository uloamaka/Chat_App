import {
  Avatar,
  Flex,
  Button,
  Tooltip,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter name in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/v1/user?search=${search}`,
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post("/api/v1/chat", { userId }, config);
      const chatData = response.data;

      if (!chats.find((c) => c.id === chatData._id)) //check if chat already exist in chat's array
      setChats([chatData, ...chats]);
      setSelectedChat(chatData);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  return (
    <>
      <Flex
        d="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w="100%"
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search your contact" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <i class="fa fa-search" aria-hidden="true"></i>
            <Text
              d={{ base: "none", md: "flex" }}
              px="4"
              ref={btnRef}
              onClick={onOpen}
            >
              Search Contacts
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily="work sans">
          My ChatApp
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.username}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Contacts</DrawerHeader>
          <DrawerBody>
            <Flex pb={2}>
              <Input
                placeholder={"Search or start a new chat"}
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {<Button onClick={handleSearch}>Go</Button>}
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner
                ml="auto"
                d="flex"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="black.500"
                size="xl"
              />
            )}
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
