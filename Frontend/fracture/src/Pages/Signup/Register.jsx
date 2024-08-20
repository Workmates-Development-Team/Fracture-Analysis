import React, { useState, useContext } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../assets/background.png";
import background2 from "../../assets/background.png";
import logo from "../../Images/Main-Logo.png";
import { AuthContext } from "../../Context/Authcontext.jsx";
import { axiosInstance } from "../../Axioshelper/Axiosinstance.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1); // Track the current step
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1); // Go to next step
  const handleBack = () => setStep(step - 1); // Go to previous step

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
        age,
        address,
      });

      if (response.status === 201) {
        toast.success("Registration successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during registration";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
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
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={450}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            width="full"
            maxHeight="450px"
            overflowY="auto"
          >
            <Stack spacing={4} align="center">
              <Heading fontSize={"3xl"} mb={4}>
                <img src={logo} alt="Logo" height={180} width={180} />
              </Heading>

              {step === 1 && (
                <>
                  <FormControl id="name">
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
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

                  <Button
                    bg={"blue.300"}
                    color={"white"}
                    _hover={{ bg: "blue.500" }}
                    onClick={handleNext}
                  width={100}>
                    Next
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <FormControl id="age">
                    <FormLabel>Age</FormLabel>
                    <Input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="street">
                    <FormLabel>Street</FormLabel>
                    <Input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                    />
                  </FormControl>
                  <FormControl id="city">
                    <FormLabel>City</FormLabel>
                    <Input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                    />
                  </FormControl>
                  <Flex direction="row" justifyContent="space-between" width="100%">
                  <Button
                    bg={"blue.300"}
                    color={"white"}
                    _hover={{ bg: "blue.500" }}
                    onClick={handleBack}
                    width={100}
                  >
                    Back
                  </Button>
                  <Button
                    bg={"blue.300"}
                    color={"white"}
                    _hover={{ bg: "blue.500" }}
                    onClick={handleNext}
                    width={100}
                  >
                    Next
                  </Button>
                  </Flex>
                </>
              )}

              {step === 3 && (
                <>
                  <FormControl id="state">
                    <FormLabel>State</FormLabel>
                    <Input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                    />
                  </FormControl>
                  <FormControl id="zip">
                    <FormLabel>ZIP Code</FormLabel>
                    <Input
                      type="text"
                      name="zip"
                      value={address.zip}
                      onChange={handleAddressChange}
                    />
                  </FormControl>
                  <Flex direction="row" justifyContent="space-between" width="100%">
                  <Button
                    bg={"blue.300"}
                    color={"white"}
                    _hover={{ bg: "blue.500" }}
                    onClick={handleBack}
                    width={100}
                  >
                    Back
                  </Button>
                  <Button
                    bg={"green.300"}
                    color={"white"}
                    _hover={{ bg: "green.500" }}
                    onClick={handleRegister}
                    width={100}
                  >
                    Register
                  </Button>
                  </Flex>
                </>
              )}
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <ToastContainer />
    </Flex>
  );
}
