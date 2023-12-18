import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import ForgetPassword from "../components/Auth/forgetPassword";
const forgetPassPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding={3}
        background="white"
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work Sans">
          forget Password
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <ForgetPassword />
      </Box>
    </Container>
  );
};

export default forgetPassPage;
