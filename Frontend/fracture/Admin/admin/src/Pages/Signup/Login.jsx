import React, { useState, useContext } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../assets/background.png";
import background2 from "../../assets/background.png";
import logo from "../../assets/Main-Logo.png";
import { AuthContext } from "../../Context/Authcontext.jsx";
import { axiosInstance } from "../../Axioshelper/Axiosinstance.js";
import { Link } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { getProfile } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/admin/login", { email, password });
      console.log(response.data);

      if (response.status === 200) {
        console.log(response.data.token);

        window.localStorage.setItem("token", response.data.token);
        getProfile()
        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "An error occurred while logging in";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <Flex minH={"100vh"} direction="row">
      <Box
        flex="1"
        backgroundImage={`url(${background})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        opacity={0.3} // Faded effect
      />
      <Box
        flex="1"
        backgroundImage={`url(${background2})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        opacity={0.3} // Faded effect
      />
      <Flex
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        align="center"
        justify="center"
        width="full"
        height="full"
        zIndex={1}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={400} > {/* Increased width */}
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            width="full"
          >
            <Stack spacing={4} align="center">
              <Heading fontSize={"3xl"} mb={4}>
                <img src={logo} alt="Logo" height={180} width={180} />
              </Heading>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Link to="/register">
                  <Text color={"blue.400"}>Not a member? Register</Text>
                  </Link>
                </Stack>
                <Button
                  bg={"green.300"}
                  color={"white"}
                  _hover={{ bg: "blue.500" }}
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <ToastContainer />
    </Flex>
  );
}
