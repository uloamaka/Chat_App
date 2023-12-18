import React from "react";
import {
  Container,
  Box,
  Text,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Signup from "../components/Auth/signup";
import Login from "../components/Auth/login";
const homePage = () => {
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
          Auth
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs align="end" variant="soft-rounded">
          <TabList mb="1em">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default homePage;
