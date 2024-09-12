import { useEffect, useState } from 'react';
import React, { useContext } from 'react';
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Button,
  Thead,
  Th,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { AuthContext } from '../Context/Authcontext';
import { NODEAPI } from '../Constant/path';
import axios from 'axios';

function AllReport() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // Store selected report details
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get(NODEAPI + "/report/reports/" + user._id);
      console.log(response?.data);
      setReports(response.data); // Assume response.data is an array of reports
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowClick = async (reportId) => {
    try {
      const response = await axios.get(`http://localhost:3400/report/report/${reportId}`);
      setSelectedReport(response.data); // Store selected report data
      onOpen(); // Open the modal
    } catch (error) {
      console.log("Error fetching report details", error);
    }
  };

  return (
    <div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Bone Type</Th>
              <Th>Result</Th>
              <Th>Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <Tr key={report._id}> {/* Assuming each report has a unique _id */}
                  <Td>{report.bone_type}</Td>
                  <Td>{report.result}</Td>
                  <Td>{report.createdAt}</Td>
                  <Td>
                    <Button onClick={() => handleShowClick(report._id)}>Show</Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5}>No reports found</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Chakra UI Modal with 3xl width */}
      {selectedReport && (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Report Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p><strong>Name:</strong> {selectedReport.name}</p>
              <p><strong>Age:</strong> {selectedReport.age}</p>
              <p><strong>Bone Type:</strong> {selectedReport.bone_type}</p>
              <p><strong>Result:</strong> {selectedReport.result}</p>
              <p><strong>Details:</strong> {selectedReport.details}</p>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}

export default AllReport;
