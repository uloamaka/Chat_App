import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    setloading(true);
    if (!email) {
      toast({
        title: "Please enter your email address",
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
      await axios.post("/api/v1/auth/forget-password", { email }, config);
      toast({
        title: "Email sent",
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
          placeholder="Enter your email address"
          onChange={({ target }) => setEmail(target.value)}
        ></Input>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        color={"white"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Forget Password
      </Button>
    </VStack>
  );
};

export default ForgetPassword;
