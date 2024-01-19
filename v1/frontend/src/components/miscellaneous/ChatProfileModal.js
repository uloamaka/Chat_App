import {
  IconButton,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import React from "react";



const ChatProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"400px"}>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"work sans"}
            textAlign="center"
          >
            {user.username}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center" // Center vertically
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.username}
              mx="auto"
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work Sans"
              textAlign="center" // Center the text
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default ChatProfileModal;