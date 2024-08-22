
import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import xray from '../assets/shared image.jpeg';
import { Box, FormControl, FormLabel, Stack, Flex, Heading, Text, Button } from '@chakra-ui/react';
import ReactToPdf from 'react-to-pdf';
import { AuthContext } from '../Context/Authcontext';

export default function Userreport() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [filename, setFilename] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const ref = useRef();

  

  //console.log(user.file_data);
  const base64Image = `data:image/jpeg;base64,${user.file_data}`;


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
              <strong>Age:</strong> {user?.age}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} mb={1}>
              <strong>Email:</strong> {user?.email}
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} mb={1}>
              <strong>Address:</strong>
              {user?.address?.street}, {user?.address?.city}, {user?.address?.state}, {user?.address?.zip}
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
              The bone type appears to be the hand. The image shows a fracture or break in one of the bones.
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Detailed Radiologist Report:</strong>
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Anatomy Observed:</strong><br />
              The x-ray image depicts the bones of the hand, including the metacarpals and phalanges. The bones appear well-aligned and demonstrate normal mineralization.
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Findings:</strong><br />
              There is a clear fracture line noted in the distal portion of the 5th metacarpal bone, as indicated by the arrow in the image. This represents a fracture of the 5th metacarpal bone. The surrounding soft tissues appear unremarkable, without any evident swelling or displacement of the fracture fragments.
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Impression:</strong><br />
              The imaging findings are consistent with a fracture of the 5th metacarpal bone of the hand.
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              <strong>Recommendations:</strong><br />
              Further clinical correlation is advised to determine the mechanism of injury and associated symptoms. Appropriate immobilization and follow-up care should be provided to monitor the healing process and ensure proper bone alignment.
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
