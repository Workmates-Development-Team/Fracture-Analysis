import React, { useContext, useState } from 'react';
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
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiLogOut,
} from 'react-icons/fi';

import logo from './workmates_logo.png';
import { AuthContext } from '../Context/Authcontext';
import AddDoctor from './AddDoctor';

const LinkItems = [
  { name: 'Home', icon: FiHome },
  { name: 'Add Doctor', icon: FiTrendingUp },
  { name: 'Add Radiologist', icon: FiCompass },
  { name: 'View All Staff', icon: FiStar },
  { name: 'View Active Case', icon: FiSettings },
  { name: 'Log Out', icon: FiLogOut }, // Log Out item
];

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, handleLogout } = useContext(AuthContext);
  
  // State to keep track of the active page
  const [activePage, setActivePage] = useState('Home');

  const renderContent = () => {
    switch (activePage) {
      case 'Home':
        return <Text fontSize="xl">Welcome to the Home Page</Text>;
      case 'Add Doctor':
        return <AddDoctor/>;
      case 'Add Radiologist':
        return <Text fontSize="xl">Add Radiologist Page Content</Text>;
      case 'View All Staff':
        return <Text fontSize="xl">View All Staff</Text>;
      case 'View Active Case':
        return <Text fontSize="xl">All patient Page</Text>;
      default:
        return <Text fontSize="xl">Welcome to the Home Page</Text>;
    }
  };

  return (
    <>
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <SidebarContent onClose={onClose} handleLogout={handleLogout} setActivePage={setActivePage} display={{ base: 'none', md: 'block' }} />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} handleLogout={handleLogout} setActivePage={setActivePage} />
          </DrawerContent>
        </Drawer>
        {/* Mobile Nav */}
        <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          Welcome {user?.name}
          {renderContent()}
        </Box>
      </Box>
    </>
  );
}

function SidebarContent({ onClose, handleLogout, setActivePage, ...rest }) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <img src={logo} alt="logo" />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={link.name === 'Log Out' ? handleLogout : () => setActivePage(link.name)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}

function NavItem({ icon, children, onClick, ...rest }) {
  return (
    <Box
      as="a"
      href="#"
      onClick={onClick}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
}

function MobileNav({ onOpen, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
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
        Logo
      </Text>
    </Flex>
  );
}
