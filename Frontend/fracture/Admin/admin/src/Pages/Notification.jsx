import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/Authcontext";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { NODEAPI } from "../Constant/path";

function Notification() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications initially
    fetchNotifications();

    // Set an interval to fetch notifications every 5 seconds
    const intervalId = setInterval(fetchNotifications, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${NODEAPI}notification/notifications-all/${user._id}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleOkClick = async (notificationId) => {
    try {
      const response = await axios.post(
        `${NODEAPI}notification/notification-update/${notificationId}`,
        { adminId: user._id }
      );
      console.log("Notification updated:", response.data);

      // Optionally, you can refetch notifications after the update
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      fetchNotifications();
    } catch (error) {
      console.error(
        "Error updating notification:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">
          Notifications
        </Text>
      </Box>

      <TableContainer>
        <Table variant="simple" bg="white">
          <Thead>
            <Tr>
              <Th>Details</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Tr key={notification._id}>
                  <Td>{notification.notification}</Td>
                  <Td alignItems="center">
                    <Button
                      colorScheme="blue"
                      onClick={() => handleOkClick(notification._id)}
                    >
                      Ok
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={2} textAlign="center">
                   No data to show
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Notification;
