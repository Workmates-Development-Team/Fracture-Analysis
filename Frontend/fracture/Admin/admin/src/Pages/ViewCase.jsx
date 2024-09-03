import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Image,
  Input,
  useToast, // Import useToast hook
} from "@chakra-ui/react";
import axios from "axios";
import { NODEAPI } from "../Constant/path";
import { AuthContext } from "../Context/Authcontext";
import Markdown from "react-markdown";

function ViewCase() {
  const [details, setDetails] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchEmail, setSearchEmail] = useState(""); 
  const toast = useToast(); // Initialize the toast hook

  useEffect(() => {
    fetchUsers();
  }, [searchEmail]); 

  const fetchUsers = async () => {
    try {
      let apiUrl;
      if (user?.role === "admin") {
        apiUrl = NODEAPI + "user/active-users";
      } else if (user?.role === "doctor") {
        apiUrl = NODEAPI + "user/non-doctor-users";
      } else if (user?.role === "radiologist") {
        apiUrl = NODEAPI + "user/non-radio-users";
      }
      
      const response = await axios.get(apiUrl, {
        params: { email: searchEmail }, 
      });
      setDetails(response?.data?.users || response?.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const createNotification = async (patient) => {
    
    console.log(patient);
    try {
      const response = await axios.post(
        NODEAPI + "notification/create-notification",
        {
          notification: `The case of : ${patient?.name} with email id : ${patient?.email} is handled by Radiologist : ${user?.email}`,
        }
      );
      console.log("Notification created:", response.data);

      // Show success toast
      toast({
        title: "Notification created",
        description: "The notification has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear the input field
    
    } catch (error) {
      console.error(
        "Error creating notification:",
        error.response?.data || error.message
      );

      // Show error toast
      toast({
        title: "Error creating notification",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const createNotificationDoc = async (patient) => {
    
    console.log(patient);
    try {
      const response = await axios.post(
        NODEAPI + "notification/create-notification",
        {
          notification: `The case of : ${patient?.name} with email id : ${patient?.email} is handled by Doctor : ${user?.email}`,
        }
      );
      console.log("Notification created:", response.data);

      // Show success toast
      toast({
        title: "Notification created",
        description: "The notification has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear the input field
    
    } catch (error) {
      console.error(
        "Error creating notification:",
        error.response?.data || error.message
      );

      // Show error toast
      toast({
        title: "Error creating notification",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const save = async (userId, details) => {
    try {
      const response = await axios.put(`${NODEAPI}user/update-user-details/${userId}`, {
        details: details,
        radioName: user?.name
      });
      console.log('User details updated successfully:', response.data);
      fetchUsers();
      toast({
        title: "Success",
        description: "User details updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user details:', error.response?.data || error.message);
      toast({
        title: "Error",
        description: "Failed to update user details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  const saveDoctor = async (userId, remarks) => {
    try {
        const response = await axios.put(`${NODEAPI}user/update-doctor-remarks/${userId}`, {
            doctorName: user?.name,
            doctorRemarks: remarks
        });
        console.log('User details updated successfully:', response.data);

        fetchUsers();
        toast({
          title: "Success",
          description: "Doctor's remarks updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return response.data;
      } catch (error) {
        console.error('Error updating user details:', error.response?.data || error.message);
        toast({
          title: "Error",
          description: "Failed to update doctor's remarks.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw error;
      }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Active Cases</Heading>
      <Input
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        mb={4}
        bg="white"
      />
      <TableContainer>
        <Table variant="simple" bg="white">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Age</Th>
              <Th>Address</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {details.map((user) => (
              <Tr key={user._id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.age}</Td>
                <Td>
                  {user.address?.street}, {user.address?.city},{" "}
                  {user.address?.state}, {user.address?.zip}
                </Td>
                <Td>
                  <Button colorScheme="green" onClick={() => handleView(user)}>
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal for displaying user details */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report</          ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <Table variant="simple" bg="white" w="full">
                <Tbody>
                  <Tr>
                    <Th>Name</Th>
                    <Td>{selectedUser.name}</Td>
                  </Tr>
                  <Tr>
                    <Th>Email</Th>
                    <Td>{selectedUser.email}</Td>
                  </Tr>
                  <Tr>
                    <Th>Age</Th>
                    <Td>{selectedUser.age}</Td>
                  </Tr>
                  <Tr>
                    <Th>Address</Th>
                    <Td>
                      {selectedUser.address?.street},{" "}
                      {selectedUser.address?.city},{" "}
                      {selectedUser.address?.state}, {selectedUser.address?.zip}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Bone Image</Th>
                    <Td>
                      <Image
                        src={`data:image/png;base64,${selectedUser.file_data}`}
                        alt="Bone Image"
                        borderRadius="md"
                        maxH="300px"
                      />
                    </Td>
                  </Tr>
                  {user?.role === "radiologist" && (
                    <Tr>
                      <Th>Details</Th>
                      <Td>
                        <Textarea
                          placeholder="Enter details here..."
                          size="sm"
                          width="100%"
                          height="300px"
                          variant="outline"
                          resize="vertical"
                          value={selectedUser.details}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              details: e.target.value,
                            })
                          }
                        />
                      </Td>
                    </Tr>
                  )}
                  {user?.role === "admin" && (
                    <Tr>
                      <Th>Details</Th>
                      <Td>
                        <Markdown>{selectedUser.details}</Markdown>
                      </Td>
                    </Tr>
                  )}
                  {user?.role === "doctor" && (
                    <Tr>
                      <Th>Doctor's Remarks</Th>
                      <Td>
                        <Textarea
                          placeholder="Enter your remarks here..."
                          size="sm"
                          width="100%"
                          height="150px"
                          variant="outline"
                          resize="vertical"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            {user?.role === "radiologist" && (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={async () => {
                  try {
                    await save(selectedUser._id, selectedUser.details);
                    createNotification(selectedUser);
                    onClose();
                  } catch (error) {
                    console.error("Failed to save details:", error);
                  }
                }}
              >
                Review and Save
              </Button>
            )}
            {user?.role === "admin" && (
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            )}
            {user?.role === "doctor" && (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={async () => {
                  try {
                    await saveDoctor(selectedUser._id, remarks);
                    createNotificationDoc(selectedUser);
                    onClose();
                  } catch (error) {
                    console.error("Failed to save details:", error);
                  }
                }}
              >
                Save
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ViewCase;
