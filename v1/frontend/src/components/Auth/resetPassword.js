import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { userId, resetToken } = useParams();
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setloading] = useState(false);
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setloading(true);
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(resetToken);
      const requestData = {
        newPassword,
        confirmPassword,
      };

      const { data } = await axios.post(
        `/api/v1/auth/reset-password/${userId}/${resetToken}`,
        requestData,
        config
      );
      toast({
        title: "Password reset successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      setloading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        stats: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
    }
  };

  return (
    <VStack>
      <FormControl id="newPassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={({ target }) => setNewPassword(target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password again!"
            onChange={({ target }) => setConfirmPassword(target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        color={"white"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Reset Password
      </Button>
    </VStack>
  );
};

export default ResetPassword;
