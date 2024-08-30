import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { AuthContext } from '../Context/Authcontext';
import { NODEAPI } from '../Constant/path';
import { DeleteIcon } from 'lucide-react';
import { EditIcon } from '@chakra-ui/icons';

const AddDoctor = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [email, setEmail] = useState('');
  const [regId, setRegId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch users when the component loads
    fetchData();
  }, []);

  const fetchData = () => {
    const token = localStorage.getItem('token');
    axios.get(NODEAPI + 'admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log(response?.data?.data);
        setUsers(response?.data?.data);
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  };

  

  const del = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(NODEAPI + `admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      console.log('User deleted successfully:', response.data);
      
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
    }
  };

  



  const saveButton = async () => {
    const data = {
      organizationName: user?.organizationName, // Adjust this as needed
      name,
      regId,
      email,
      degree,
      password,
      role,
    };

    try {
      const response = await axios.post(NODEAPI + 'admin/register', data);
      // Handle successful registration
      console.log('Registration successful:', response.data);
      fetchData(); // Refresh the users list
      onClose(); // Close the modal
    } catch (error) {
      // Handle errors
      console.error('Registration failed:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <Flex justifyContent="flex-end" mb={4}>
        <Button colorScheme="teal" onClick={onOpen}>
          Add Staff
        </Button>
      </Flex>

      <TableContainer>
        <Table variant='simple' bg="white">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Degree</Th>
              <Th>Email</Th>
              <Th>Registration Id</Th>
              <Th>Role</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={index}>
                <Td>{user?.name}</Td>
                <Td>{user?.degree}</Td>
                <Td>{user?.email}</Td>
                <Td>{user?.regId}</Td>
                <Td>{user?.role}</Td>
                <Td>
                  <Button
                    colorScheme='red'
                    onClick={() => del(user._id)}
                    
                  >
                    Delete
                  </Button>
                  {" | "}
                  <Button colorScheme='green' >
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
            {/* More rows can be added here */}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New Doctor/Radiologist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              mb={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Degree"
              mb={3}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
            <Input
              placeholder="Email"
              mb={3}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Registration Id"
              mb={3}
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              mb={3}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select
              placeholder="Select Role"
              mb={3}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="radiologist">Radiologist</option>
              <option value="doctor">Doctor</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={saveButton}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddDoctor;
