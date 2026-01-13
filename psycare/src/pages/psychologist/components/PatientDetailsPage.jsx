import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  VStack,
  Spinner,
  useToast,
  Box,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import {
  PageContainer,
  HeaderBox,
  WelcomeHeading,
  InfoText,
  SectionBox,
  SectionHeader,
  SectionTitle,
  PatientCardBox,
  LoadingText,
  ModalInput,
  PrimaryButton,
  SecondaryButton,
  PatientDetailText,
  Col,
} from "../StyledComponents";
import { MoodEntriesDisplay } from "../../patient/components/MoodEntriesDisplay";

export const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state for editable fields
  const [diagnosis, setDiagnosis] = useState("");
  const [psychologistNotes, setPsychologistNotes] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5075/Patients/get-patient/${patientId}`
        );
        if (!response.ok) {
          throw new Error("Patient not found");
        }
        const data = await response.json();
        setPatient(data);
        setDiagnosis(data.diagnosis || "");
        setPsychologistNotes(data.psychologistNotes || "");
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast({
          title: "Error fetching patient",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5075/Patients/update-patient/${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diagnosis, psychologistNotes }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update patient");
      }
      toast({
        title: "Patient updated",
        description: "Diagnosis and notes saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error saving changes",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer maxW="container.xl">
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" color="#6b46c1" />
          <LoadingText>Loading patient details...</LoadingText>
        </Box>
      </PageContainer>
    );
  }

  if (!patient) {
    return (
      <PageContainer maxW="container.xl">
        <Box textAlign="center" mt={10}>
          <LoadingText>Patient not found.</LoadingText>
          <SecondaryButton mt={4} onClick={() => navigate(-1)}>
            Go Back
          </SecondaryButton>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxW="container.lg">
      <Col spacing={6} align="stretch">
        {/* Header */}
        <HeaderBox>
          <WelcomeHeading>Patient Details</WelcomeHeading>
        </HeaderBox>

        {/* Patient Information Card */}
        <HStack spacing={4} justify="end" align="center">
          <SecondaryButton onClick={() => navigate(-1)}>
            Go Back
          </SecondaryButton>
        </HStack>
        <HStack spacing={6} align="stretch" w="100%" minH="400px">
          <SectionBox flex="1">
            <SectionHeader>
              <SectionTitle>Personal Information</SectionTitle>
            </SectionHeader>
            <PatientCardBox flex="1">
              <VStack spacing={3} align="stretch">
                <Box>
                  <InfoText as="span" fontWeight="600" color="#2d3748">
                    Name:{" "}
                  </InfoText>
                  <InfoText as="span">{patient.name}</InfoText>
                </Box>
                <Box>
                  <InfoText as="span" fontWeight="600" color="#2d3748">
                    Email:{" "}
                  </InfoText>
                  <InfoText as="span">{patient.email}</InfoText>
                </Box>
                <Box>
                  <InfoText as="span" fontWeight="600" color="#2d3748">
                    Phone:{" "}
                  </InfoText>
                  <InfoText as="span">{patient.phoneNumber}</InfoText>
                </Box>
                <Box>
                  <InfoText as="span" fontWeight="600" color="#2d3748">
                    Age:{" "}
                  </InfoText>
                  <InfoText as="span">{patient.age}</InfoText>
                </Box>
                {patient.location && (
                  <Box>
                    <InfoText as="span" fontWeight="600" color="#2d3748">
                      Location:{" "}
                    </InfoText>
                    <InfoText as="span">{patient.location}</InfoText>
                  </Box>
                )}
                {patient.issueDescription && (
                  <Box>
                    <InfoText as="span" fontWeight="600" color="#2d3748">
                      Issue Description:{" "}
                    </InfoText>
                    <InfoText as="span">{patient.issueDescription}</InfoText>
                  </Box>
                )}
              </VStack>
            </PatientCardBox>
          </SectionBox>

          {/* Clinical Information */}
          <SectionBox flex="1">
            <SectionHeader>
              <SectionTitle>Clinical Information</SectionTitle>
            </SectionHeader>
            <PatientCardBox flex="1">
              <VStack spacing={4} align="stretch">
                <Box>
                  <PatientDetailText fontWeight="600" mb={2}>
                    Diagnosis
                  </PatientDetailText>
                  <ModalInput
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter diagnosis..."
                  />
                </Box>
                <Box>
                  <PatientDetailText fontWeight="600" mb={2}>
                    Psychologist Notes
                  </PatientDetailText>
                  <Textarea
                    value={psychologistNotes}
                    onChange={(e) => setPsychologistNotes(e.target.value)}
                    placeholder="Enter notes..."
                    minH="120px"
                    borderRadius="8px"
                    borderColor="#e2e8f0"
                    _focus={{
                      borderColor: "#6b46c1",
                      boxShadow: "0 0 0 1px #6b46c1",
                    }}
                  />
                </Box>
              </VStack>
            </PatientCardBox>
          </SectionBox>
        </HStack>

        {/* Mood Entries Section with Chart and Stats */}
        <MoodEntriesDisplay
          patientId={patientId}
          showActions={false}
          showChart={true}
          showStats={true}
        />

        {/* Action Buttons */}
        <HStack spacing={3} justify="flex-end">
          <SecondaryButton onClick={() => navigate(-1)}>
            Go Back
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSave}
            isLoading={saving}
            loadingText="Saving..."
          >
            Save Changes
          </PrimaryButton>
        </HStack>
      </Col>
    </PageContainer>
  );
};
