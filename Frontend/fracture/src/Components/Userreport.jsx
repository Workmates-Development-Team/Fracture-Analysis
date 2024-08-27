
import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import xray from '../assets/shared image.jpeg';
import { Box, FormControl, FormLabel, Stack, Flex, Heading, Text, Button } from '@chakra-ui/react';
import ReactToPdf from 'react-to-pdf';
import { AuthContext } from '../Context/Authcontext';
import { axiosInstance } from '../Axioshelper/Axiosinstance';

export default function Userreport() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [report, setReport] = useState();
  const navigate = useNavigate();
  const { user, getProfile } = useContext(AuthContext);
  const ref = useRef();

  useEffect(() => {
    
    fetchData();
    console.log(user);
  }, []);
  
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/user/profile");
      console.log(data?.user);
      setPredictionResult(data?.user);
      const result = extractSections(data?.user?.details);
      console.log(result);
      setReport(result);
    } catch (error) {
      console.log(error);
    }
  };

  const extractSections = (inputText) => {
    const sections = {};

    // Regular expressions to match each section
    const regexPatterns = {
        anatomyObserved: /Anatomy Observed:\n([\s\S]*?)(?=\n\w+:|\n$)/,
        findings: /Findings:\n([\s\S]*?)(?=\n\w+:|\n$)/,
        impression: /Impression:\n([\s\S]*?)(?=\n\w+:|\n$)/,
        recommendations: /Recommendations:\n([\s\S]*)$/,
    };

    // Extracting each section
    for (const [key, regex] of Object.entries(regexPatterns)) {
        const match = inputText.match(regex);
        sections[key] = match ? match[1].trim() : null;
    }

    return sections;
};

  //console.log(user.file_data);
  const base64Image = `data:image/jpeg;base64,${predictionResult?.file_data}`;

 
  

  const handlePrint = () => {
   
  };



  return (
    <Stack direction={{ base: 'column', md: 'row' }} height="130vh">
      {/* Scrollable Flex Container */}
      <Flex
        p={8}
        flex={1}
        align={'center'}
        justify={'center'}
        position="relative"
        overflowY="auto"
        maxH={'130vh'}
        direction="column"
      >
        <Stack spacing={1} w={'full'} maxW={'lg'} ref={ref}>
          {/* Patient Details Section */}
          <Stack spacing={1} mb={8}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} color={'blue.800'} mb={1}>
              Patient Details:
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} mb={1}>
              <strong>Name:</strong> {user?.name}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} mb={1}>
              <strong>Age:</strong> {predictionResult?.age}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} mb={1}>
              <strong>Email:</strong> {user?.email}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} mb={1}>
              <strong>Address:</strong>
              {predictionResult?.address?.street}, {predictionResult?.address?.city}, {predictionResult?.address?.state}, {predictionResult?.address?.zip}
            </Text>
          </Stack>

          {/* Report Section */}
          <Stack spacing={8} w={'full'} maxW={'lg'} ref={ref}   overflowY="auto" maxH="calc(100vh - 150px)">
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} mt={8}>
              <Text as={'span'} position={'relative'} color={'blue.800'}>
                Report:
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              The bone type appears to be {predictionResult?.bone_type}. The image shows {predictionResult?.result} bone.
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Detailed Radiologist Report:</strong>
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Anatomy Observed:</strong><br />
              {/* The x-ray image depicts the bones of the hand, including the metacarpals and phalanges. The bones appear well-aligned and demonstrate normal mineralization. */}
              {report?.anatomyObserved}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Findings:</strong><br />
              {/* There is a clear fracture line noted in the distal portion of the 5th metacarpal bone, as indicated by the arrow in the image. This represents a fracture of the 5th metacarpal bone. The surrounding soft tissues appear unremarkable, without any evident swelling or displacement of the fracture fragments. */}
              {report?.findings}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Impression:</strong><br />
              {/* The imaging findings are consistent with a fracture of the 5th metacarpal bone of the hand. */}
              {report?.impression}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Recommendations:</strong><br />
              {/* Further clinical correlation is advised to determine the mechanism of injury and associated symptoms. Appropriate immobilization and follow-up care should be provided to monitor the healing process and ensure proper bone alignment. */}
          
              {report?.recommendations} 
              </Text>
           
            
          </Stack>
        </Stack>
        <Button
          colorScheme="blue"
          variant="outline"
          position="absolute"
          top={4}
          right={4}
          size="sm"
          onClick={handlePrint}
        >
          Download as PDF
        </Button>
      </Flex>

      {/* X-ray Image Section */}
      <Flex flex={1}>
        <Box className="detect-container">
          <Box className="detectHeader" />
          <Box className="upload-form">
            <Stack spacing={6} align="center" p={6} bg="blue.900" borderRadius="md" maxW="md" mx="auto" mt={{ base: '-30px', md: '-80px' }}>
              <FormControl>
                <FormLabel htmlFor="image" display="flex" flexDirection="column" alignItems="center" color="white">
                  {/* <img src={xray} height={450} width={450} alt="X-ray Image" /> */}
                  <img src={base64Image} height={450} width={450} alt="X-ray Image" />

                </FormLabel>
              </FormControl>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Stack>
  );
}
