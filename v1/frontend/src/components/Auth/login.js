import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Link as ChakraLink,
  LinkProps,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
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
      const { data } = await axios.post(
        "/api/v1/auth/login",
        { email, password },
        config
      );
      toast({
        title: "Login successful",
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
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter a valid email address"
          onChange={({ target }) => setEmail(target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={({ target }) => setPassword(target.value)}
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
        Login
      </Button>

      <ChakraLink as={ReactRouterLink} to="/forget_password">
        forget_password
      </ChakraLink>
    </VStack>
  );
};

export default Login;
