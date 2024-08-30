import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NODEAPI } from '../Constant/path';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const toast = useToast();

  const handleChangePassword = async () => {
    try {
        const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage
      
        const response = await axios.post(
          NODEAPI + 'admin/change-password',
          {
            currentPassword:oldPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Adding the token to the headers
            },
          }
        );
      
        toast({
          title: "Password changed successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error changing password.",
          description: error.response?.data?.message || "An error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} bg="white" p={5}>
      <FormControl id="old-password" mb={4}>
        <FormLabel>Old Password</FormLabel>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </FormControl>

      <FormControl id="new-password" mb={4}>
        <FormLabel>New Password</FormLabel>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormControl>

      <Button colorScheme="blue" onClick={handleChangePassword}>
        Change Password
      </Button>
    </Box>
  );
}

export default ChangePassword;
