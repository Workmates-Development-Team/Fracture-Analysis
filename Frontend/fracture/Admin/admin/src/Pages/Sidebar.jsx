import React, { useContext, useEffect, useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiBell, // Import the notification icon
} from "react-icons/fi";

import logo from "./workmates_logo.png";
import { AuthContext } from "../Context/Authcontext";
import AddDoctor from "./AddDoctor";
import ChangePassword from "./ChangePassword";
import ViewCase from "./ViewCase";
import Notification from "./Notification";
import axios from "axios";
import { NODEAPI } from "../Constant/path";

const LinkItems = [
  { name: "Home", icon: FiHome },
  { name: "Staff", icon: FiTrendingUp },
  { name: "Change Password", icon: FiSettings },
  { name: "Notification", icon: FiBell }, // New Notification item
  { name: "Log Out", icon: FiLogOut }, // Log Out item
];

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, handleLogout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  // State to keep track of the active page
  const [activePage, setActivePage] = useState("Home");

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

  const renderContent = () => {
    switch (activePage) {
      case "Home":
        return <ViewCase />;
      case "Staff":
        return <AddDoctor />;
      case "Change Password":
        return <ChangePassword />;
      case "Notification":
        return <Notification />;
      default:
        return <Text fontSize="xl">Welcome to the Home Page</Text>;
    }
  };

  return (
    <>
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <SidebarContent
          onClose={onClose}
          handleLogout={handleLogout}
          setActivePage={setActivePage}
          userRole={user?.role} // Pass the user role as a prop
          notifications={notifications} // Pass notifications as a prop
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent
              onClose={onClose}
              handleLogout={handleLogout}
              setActivePage={setActivePage}
              userRole={user?.role} // Pass the user role as a prop
              notifications={notifications} // Pass notifications as a prop
            />
          </DrawerContent>
        </Drawer>
        {/* Mobile Nav */}
        <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          {user?.role === "admin" ? (
            <Badge colorScheme="green">Hello, {user?.role}</Badge>
          ) : (
            <Badge colorScheme="green">
              Hello, {user?.name} , {user?.role}
            </Badge>
          )}

          {renderContent()}
        </Box>
      </Box>
    </>
  );
}

function SidebarContent({
  onClose,
  handleLogout,
  setActivePage,
  userRole,
  notifications, // Receive the notifications as a prop
  ...rest
}) {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <img src={logo} alt="logo" />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        // Conditionally render "Staff" only if the user role is 'admin'
        if (link.name === "Staff" && userRole !== "admin") {
          return null;
        }

        return (
          <NavItem
            key={link.name}
            icon={link.icon}
            onClick={
              link.name === "Log Out"
                ? handleLogout
                : () => setActivePage(link.name)
            }
          >
            {link.name}

            {/* If the link is Notification and there are unread notifications, show a red dot */}
            {link.name === "Notification" && notifications.length > 0 && (
              <Box
                as="span"
                ml="2"
                bg="red.500"
                borderRadius="full"
                boxSize="8px"
                display="inline-block"
              />
            )}
          </NavItem>
        );
      })}
    </Box>
  );
}

function NavItem({ icon, children, ...rest }) {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "cyan.400",
        color: "white",
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
}

function MobileNav({ onOpen, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Dashboard
      </Text>
    </Flex>
  );
}
