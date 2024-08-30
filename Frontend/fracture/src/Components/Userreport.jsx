import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import xray from "../assets/shared image.jpeg";
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { AuthContext } from "../Context/Authcontext";
import { axiosInstance } from "../Axioshelper/Axiosinstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Userreport() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [report, setReport] = useState();
  const navigate = useNavigate();
  const { user, getProfile } = useContext(AuthContext);
  const ref = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const base64Image = `data:image/jpeg;base64,${predictionResult?.file_data}`;

  const handlePrint = () => {
    html2canvas(ref.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Left margin padding in mm
      const leftMargin = 10; 
      
      // Add first page with left margin padding
      pdf.addImage(imgData, "PNG", leftMargin, position, imgWidth - 2 * leftMargin, imgHeight);
      heightLeft -= pageHeight;
  
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", leftMargin, position, imgWidth - 2 * leftMargin, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save("report.pdf");
    });
  };
  
  return (
    <Stack direction={{ base: "column", md: "row" }} height="130vh">
      {/* Scrollable Flex Container */}
      <Flex
        p={8}
        flex={1}
        align={"center"}
        justify={"center"}
        position="relative"
        overflowY="auto"
        maxH={"130vh"}
        direction="column"
      >
        <Stack spacing={1} w={"full"} maxW={"lg"} ref={ref}>
          {/* Patient Details Section */}
          <Stack spacing={1} mb={8}>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              color={"blue.800"}
              mb={1}
            >
              Patient Details:
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"} mb={1}>
              <strong>Name:</strong> {user?.name}
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"} mb={1}>
              <strong>Age:</strong> {predictionResult?.age}
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"} mb={1}>
              <strong>Email:</strong> {user?.email}
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"} mb={1}>
              <strong>Address:</strong>
              {predictionResult?.address?.street},{" "}
              {predictionResult?.address?.city},{" "}
              {predictionResult?.address?.state},{" "}
              {predictionResult?.address?.zip}
            </Text>
          </Stack>

          {/* Report Section */}
          <Stack
            spacing={8}
            w={"full"}
            maxW={"lg"}
            ref={ref}
            overflowY="auto"
            maxH="calc(100vh - 150px)"
          >
            <Heading fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} mt={8}>
              <Text as={"span"} position={"relative"} color={"blue.800"}>
                Report:
              </Text>
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              The bone type appears to be {predictionResult?.bone_type}. The
              image shows {predictionResult?.result} bone.
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              <strong>Detailed Radiologist Report:</strong>
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              <strong>Anatomy Observed:</strong>
              <br />
              {report?.anatomyObserved}
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              <strong>Findings:</strong>
              <br />
              {report?.findings}
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              <strong>Impression:</strong>
              <br />
              {report?.impression}
            </Text>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              <strong>Recommendations:</strong>
              <br />
              {report?.recommendations}
            </Text>

            {predictionResult?.doctorRemarks && (
              <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                <strong>Doctors Remarks:</strong>
                <br />
                {predictionResult?.doctorRemarks}
              </Text>
            )}

            {predictionResult?.doctorName && (
              <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                <strong>Doctors Name:</strong>
                <br />
                <Badge colorScheme="green">
                  {predictionResult?.doctorName}
                </Badge>
              </Text>
            )}

            {predictionResult?.isRadio && (
              <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                <strong>Reviewed By:</strong>
                <br />
                Radiologist :{" "}
                <Badge colorScheme="green">{predictionResult?.radioName}</Badge>
              </Text>
            )}

            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              <strong>Disclaimer:</strong>
              <br />
              <Badge colorScheme="red">
                This is an Ai generated report
              </Badge>
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
          onClick={onOpen} // Open the modal
        >
          Download as PDF
        </Button>
      </Flex>

      {/* X-ray Image Section */}
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
              mt={{ base: "-30px", md: "-80px" }}
            >
              <FormControl>
                <FormLabel
                  htmlFor="image"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  color="white"
                >
                  <img
                    src={base64Image}
                    height={450}
                    width={450}
                    alt="X-ray Image"
                  />
                </FormLabel>
              </FormControl>
            </Stack>
          </Box>
        </Box>
      </Flex>

      {/* Modal for PDF Download */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} ref={ref}>
              <Heading fontSize="xl" color="blue.800">Patient Details:</Heading>
              <Text><strong>Name:</strong> {user?.name}</Text>
              <Text><strong>Age:</strong> {predictionResult?.age}</Text>
              <Text><strong>Email:</strong> {user?.email}</Text>
              <Text><strong>Address:</strong> {predictionResult?.address?.street}, {predictionResult?.address?.city}, {predictionResult?.address?.state}, {predictionResult?.address?.zip}</Text>
              
              <Heading fontSize="xl" color="blue.800">Report:</Heading>
              <Text>The bone type appears to be {predictionResult?.bone_type}. The image shows {predictionResult?.result} bone.</Text>
              <Text><strong>Detailed Radiologist Report:</strong></Text>
              <Text><strong>Anatomy Observed:</strong> {report?.anatomyObserved}</Text>
              <Text><strong>Findings:</strong> {report?.findings}</Text>
              <Text><strong>Impression:</strong> {report?.impression}</Text>
              <Text><strong>Recommendations:</strong> {report?.recommendations}</Text>
              
              {predictionResult?.doctorRemarks && (
                <Text><strong>Doctors Remarks:</strong> {predictionResult?.doctorRemarks}</Text>
              )}
              
              {predictionResult?.doctorName && (
                <Text><strong>Doctors Name:</strong> <Badge colorScheme="green">{predictionResult?.doctorName}</Badge></Text>
              )}
              
              {predictionResult?.isRadio && (
                <Text><strong>Reviewed By:</strong> Radiologist : <Badge colorScheme="green">{predictionResult?.radioName}</Badge></Text>
              )}
              
              <Text><strong>Disclaimer:</strong> <Badge colorScheme="red">This is an Ai generated report</Badge></Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePrint}>
              Save as PDF
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
