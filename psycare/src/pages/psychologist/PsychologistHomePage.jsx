import { useState, useEffect } from "react";
import { VStack, useToast, useDisclosure } from "@chakra-ui/react";
import { PatientsList } from "./components/PatientsList";
import { AddPatientModal } from "./components/AddPatientModal";
import {
  PageContainer,
  HeaderBox,
  WelcomeHeading,
  InfoText,
} from "./StyledComponents";

export const PsychologistPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch patients list
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:5075/Users/psychologist/${user.data.id}/patients`
      );
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket for crisis alerts
  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:5075/ws?psychologistId=${user.data.id}`
    );

    ws.onmessage = (event) => {
      const message = event.data;
      toast({
        title: "Crisis Alert!",
        description: message,
        status: "error",
        duration: 20000,
        isClosable: true,
      });
    };

    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error", err);

    return () => ws.close();
  }, [user.data.id, toast]);

  const handleDeletePatient = async (patientId) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Users/patient/${patientId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Patient removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Refresh the list
        fetchPatients();
      } else {
        throw new Error("Failed to delete patient");
      }
    } catch (error) {
      toast({
        title: "Error deleting patient",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddPatient = async (patientEmail) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Users/psychologist/${user.data.id}/add-patient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: patientEmail }),
        }
      );

      if (response.ok) {
        toast({
          title: "Patient added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        fetchPatients();
      } else {
        throw new Error("Failed to add patient");
      }
    } catch (error) {
      toast({
        title: "Error adding patient",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <PageContainer maxW="container.xl">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HeaderBox>
          <WelcomeHeading>Welcome, Dr. {user.data.name}</WelcomeHeading>
          <InfoText>Email: {user.data.email}</InfoText>
          <InfoText>Location: {user.data.location}</InfoText>
        </HeaderBox>

        {/* Patients Section */}
        <PatientsList
          patients={patients}
          loading={loading}
          onDelete={handleDeletePatient}
          onAddClick={onOpen}
        />
      </VStack>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isOpen}
        onClose={onClose}
        onAdd={handleAddPatient}
      />
    </PageContainer>
  );
};
