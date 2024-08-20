import React, { useState,useContext } from 'react';
import axios from 'axios';
'use client'
import './HeroSection.css'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from "react-router-dom";
import {
    Box,
    
  
    FormControl,
    FormLabel,
    Input,
    
  } from '@chakra-ui/react';
import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { AuthContext } from "../Context/Authcontext";
export default function HeroSection() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [filename, setFilename] = useState('');
    const [imageUploaded, setImageUploaded] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate=useNavigate();
    const handleImageUpload = async(e) => {
        const imageFile = e.target.files[0];
        console.log(e.target.files[0])
        const userId = user._id;
       
        if (imageFile) {
            // const imageUrl = URL.createObjectURL(imageFile); // Create a temporary URL for the image
            // setUploadedImage(imageUrl);
            setImageUploaded(true);
            console.log(imageFile);
            const formData = new FormData();
            formData.append('file', imageFile)
            try {
                const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        
                    }
                });
                setFilename(response.data.filename);
                const imageUrl = URL.createObjectURL(imageFile); // Create a temporary URL for the image
                setUploadedImage(imageUrl);
                
                console.log('Uploaded:', response.data.filename);
                console.log(userId)
            } catch (error) {
                console.error('Error uploading the image:', error);
            }
    
          }
 
      };
      const handlePrediction = async () => {
        console.log('Prediction button clicked'); 
        try {
          if (!filename) {
            console.error('Filename is not set'); 
            return;
          }
    
          const requestBody = {
            filename: filename // Use the filename stored from the upload response
          };
    
          const response = await axios.post('http://127.0.0.1:5000/predict', requestBody);
         
           console.log('Prediction Result:', response.data); 
           setPredictionResult(response.data); // Output the result to the console
        } catch (error) {
          console.error('Error fetching prediction:', error);
        }
      };
      const viewreport = async()=>{
        navigate('/report');
      }
  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
            <Text
              as={'span'}
              position={'relative'}
              color={'blue.800'} 
          
            >
              Fracture
            </Text>
            <br />{' '}
            <Text color={'blue.800'} as={'span'}>
              Analyzer
            </Text>{' '}
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
          Fracture analysis provides critical insights into bone integrity, identifying fractures with precision. Essential for timely diagnosis and effective treatment planning.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button
              rounded={'full'}
              bg={'blue.800'}
              color={'white'}
              _hover={{
                bg: 'blue.400',
               
              }}
              onClick={handlePrediction}>
                Check
            </Button>
            <Button rounded={'full'} onClick={viewreport}>View Report</Button>
          </Stack>

          {predictionResult && (
        <Stack spacing={2} mt={4}>
          <Text fontSize="lg" fontWeight="bold" color="blue.800">Prediction Result:</Text>
          {Object.entries(predictionResult).map(([key, value]) => (
            <Text key={key} color="blue.800">
              {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}: {value}
            </Text>
          ))}
        </Stack>
      )}
     
        </Stack>
      </Flex>
      <Flex flex={1}>
        {/* <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          }
        /> */}
       
       <Box className="detect-container">
      <Box className="detectHeader" />
      <Box className="upload-form">
        {/* <FormControl>
          <FormLabel htmlFor="image" className="upload-label">
          <CloudUploadIcon style={{marginRight:'1vw'}}/>
            Upload Image
          </FormLabel>
          <Input
            type="file"
            accept="image/*"
            id="image"
            className="upload-input"
          />
        </FormControl>

        <Stack spacing={4} >
          <Text fontSize="lg" fontWeight="bold"color="white">Instructions:</Text>
          <Stack spacing={2} textAlign="center">
            <Text className="step" color="white">1. Click on "Upload Image" button</Text>
            <Text className="step" color="white">2. Select an image file</Text>
            <Text className="step"color="white">3. Wait for the result</Text>
          </Stack>
        </Stack> */}
          <Stack spacing={6} align="center" p={6} bg="blue.900" borderRadius="md" maxW="md" mx="auto">
      <FormControl>
        <FormLabel htmlFor="image" display="flex" flexDirection="column" alignItems="center" color="white">
        {uploadedImage && (
        <Image src={uploadedImage} alt="Uploaded X-Ray" mt={4} maxWidth="300px" />
      )}
          <CloudUploadIcon style={{ fontSize: '3rem', marginBottom: '10px' }} />
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
     
       
        <Text fontSize="lg" fontWeight="bold" color="yellow.400">Instructions:</Text>
        <Stack spacing={2}>
          <Text className="step" color="yellow.400">1. Click on "Upload X-Ray"  Icon</Text>
          <Text className="step" color="yellow.400">2. Select an image file</Text>
          <Text className="step" color="yellow.400">3. Wait for the result</Text>
        </Stack>
      </Stack>
      )}
  
    </Stack>
      </Box>
    </Box>
       

      </Flex>
    </Stack>
  )
}