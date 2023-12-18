import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import ResetPassword from "../components/Auth/resetPassword";
const resetPassPage = () => {
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
          Reset Password
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <ResetPassword />
      </Box>
    </Container>
  );
};

export default resetPassPage;
