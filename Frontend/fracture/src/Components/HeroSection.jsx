import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
("use client");
import "./HeroSection.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { Box, FormControl, FormLabel, Input, Progress } from "@chakra-ui/react";
import { Button, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { AuthContext } from "../Context/Authcontext";
import { axiosInstance } from "../Axioshelper/Axiosinstance";
import { NODEAPI, PYTHON_BEDROCK, PYTHON_CNN } from "../Constant/path";

export default function HeroSection() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const { user, getProfile } = useContext(AuthContext);
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState();
  const navigate = useNavigate();
 useEffect(() => {
  fetchUserProfile();
  
    
  },[]);

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage or wherever it's stored
  
      if (!token) {
        throw new Error('No token found');
      }
  
      const { data } = await axios.get(NODEAPI+"/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      
      console.log(data?.user);
      if( data?.user?.details)
        {
          setToggle(false);
        }
      setPatientData(data?.user);
      
  
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      // Handle the error, e.g., by showing a notification to the user
    }
  }

  const handleImageUpload = (e) => {
    setToggle(true);
    const file = e.target.files[0];
    setImageUploaded(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setUploadedImage(base64String);
        console.log(file);
      };
      reader.readAsDataURL(file); // Converts file to base64 string
    }
  };

  const handleCheck = async () => {
    
   if( predictionResult?.details)
  {
    setToggle(false);
  }else{



    setLoading(true);
    if (!uploadedImage) {
      console.error("No image uploaded");
      return;
    }
    var prompt = "";
    const formData = new FormData();
    formData.append("file", imageUploaded);
    formData.append("user_id", user._id);

    try {
      const response = await axios.post(
        PYTHON_CNN+"/upload_predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Prediction Result:", response?.data);
      setPredictionResult(response?.data);
      prompt = `${response?.data?.bone_type}  ${response?.data?.result}`;
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }

    const formData2 = new FormData();
    formData2.append("image", imageUploaded);
    formData2.append("prompt", prompt);
    formData2.append("_id", user?._id);

    try {
      const response2 = await axios.post(
        PYTHON_BEDROCK+"/img",
        formData2,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Details Result:", response2?.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
    setLoading(false);
    setToggle(false);
  }
  };

  

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text as={"span"} position={"relative"} color={"blue.800"}>
              Fracture
            </Text>
            <br />
            <Text color={"blue.800"} as={"span"}>
              Analyzer
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Fracture analysis provides critical insights into bone integrity,
            identifying fractures with precision. Essential for timely diagnosis
            and effective treatment planning.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            {loading ? (
              <>
                Analyzing...
              </>
            ) : (
              <>
              {
                toggle?
                <Button
                  rounded={"full"}
                  bg={"blue.800"}
                  color={"white"}
                  _hover={{
                    bg: "blue.400",
                  }}
                  onClick={handleCheck}
                >
                  Check
                </Button> :

                <Button rounded={"full"} onClick={() => navigate("/report")}>
                  View Report
                </Button>
              
            }
            </>
            )}
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Box className="detect-container">
          <Box className="detectHeader" />
          <Box className="upload-form">
            <Stack
              spacing={6}
              align="center"
              p={6}
              bg="blue.900"
              borderRadius="md"
              maxW="md"
              mx="auto"
            >
              <FormControl>
                <FormLabel
                  htmlFor="image"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  color="white"
                >
                  {uploadedImage && (
                    <Image
                      src={uploadedImage}
                      alt="Uploaded X-Ray"
                      mt={4}
                      maxWidth="300px"
                    />
                  )}
                  <CloudUploadIcon
                    style={{ fontSize: "3rem", marginBottom: "10px" }}
                  />
                  Upload X-Ray
                </FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  id="image"
                  display="none"
                  className="upload-input"
                  onChange={handleImageUpload}
                />
              </FormControl>
              {!imageUploaded && (
                <Stack spacing={4} textAlign="center">
                  <Text fontSize="lg" fontWeight="bold" color="yellow.400">
                    Instructions:
                  </Text>
                  <Stack spacing={2}>
                    <Text className="step" color="yellow.400">
                      1. Click on "Upload X-Ray" Icon
                    </Text>
                    <Text className="step" color="yellow.400">
                      2. Select an image file
                    </Text>
                    <Text className="step" color="yellow.400">
                      3. Wait for the result
                    </Text>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Stack>
  );
}
