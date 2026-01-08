import { useState, useEffect } from "react";
import { VStack, useToast } from "@chakra-ui/react";
import {
  PageContainer,
  HeaderBox,
  WelcomeHeading,
  InfoSection,
  SectionTitle,
  InfoText,
  InfoLabel,
  PsychologistCard,
  PsychologistName,
  PsychologistInfo,
  SelectButton,
  PsychologistSelect,
  SelectContainer,
  EmptyMessage,
} from "./StyledComponents";

export const PatientPage = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [selectedPsychologistEmail, setSelectedPsychologistEmail] =
    useState("");
  const [loadingPsychologists, setLoadingPsychologists] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const toast = useToast();

  // Fetch psychologists on component mount
  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    try {
      setLoadingPsychologists(true);
      const response = await fetch(
        "http://localhost:5075/Users/all-psychologists"
      );
      if (response.ok) {
        const data = await response.json();
        setPsychologists(data);
      }
    } catch (error) {
      console.error("Error fetching psychologists:", error);
      toast({
        title: "Error loading psychologists",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingPsychologists(false);
    }
  };

  const handleSelectPsychologist = async () => {
    if (!selectedPsychologistEmail) {
      toast({
        title: "Please select a psychologist",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5075/Users/patient/${user.data.id}/assign-psychologist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            psychologistEmail: selectedPsychologistEmail,
          }),
        }
      );

      if (response.ok) {
        // Update the current user in localStorage
        const updatedUser = {
          ...user,
          data: {
            ...user.data,
            psychologistEmail: selectedPsychologistEmail,
          },
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        toast({
          title: "Psychologist assigned successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setSelectedPsychologistEmail("");
        window.location.reload(); // Refresh to update the display
      } else {
        throw new Error("Failed to assign psychologist");
      }
    } catch (error) {
      toast({
        title: "Error assigning psychologist",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <PageContainer maxW="container.lg">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HeaderBox>
          <WelcomeHeading>Welcome, {user.data.name}</WelcomeHeading>
        </HeaderBox>

        {/* Patient Details Section */}
        <InfoSection>
          <SectionTitle>Your Details</SectionTitle>
          <InfoText>
            <InfoLabel>Email: </InfoLabel>
            {user.data.email}
          </InfoText>
          <InfoText>
            <InfoLabel>Phone: </InfoLabel>
            {user.data.phoneNumber}
          </InfoText>
          <InfoText>
            <InfoLabel>Age: </InfoLabel>
            {user.data.age}
          </InfoText>
          <InfoText>
            <InfoLabel>Location: </InfoLabel>
            {user.data.location}
          </InfoText>
          <InfoText>
            <InfoLabel>Problem: </InfoLabel>
            {user.data.problem}
          </InfoText>
        </InfoSection>

        {/* Current Psychologist Section */}
        {user.data.psychologistEmail ? (
          <PsychologistCard>
            <PsychologistName>Your Psychologist</PsychologistName>
            <PsychologistInfo>
              <InfoLabel>Email: </InfoLabel>
              {user.data.psychologistEmail}
            </PsychologistInfo>
          </PsychologistCard>
        ) : (
          <InfoSection>
            <SectionTitle>No Psychologist Assigned</SectionTitle>
            <EmptyMessage>
              You don't have a psychologist assigned yet. Please select one
              below.
            </EmptyMessage>
          </InfoSection>
        )}

        {/* Select Psychologist Section */}
        <InfoSection>
          <SectionTitle>Select a Psychologist</SectionTitle>
          <SelectContainer>
            <PsychologistSelect
              value={selectedPsychologistEmail}
              onChange={(e) => setSelectedPsychologistEmail(e.target.value)}
              disabled={loadingPsychologists}
            >
              <option value="">
                {loadingPsychologists
                  ? "Loading..."
                  : "Choose a psychologist..."}
              </option>
              {psychologists.map((psych) => (
                <option key={psych.id} value={psych.email}>
                  {psych.email}
                </option>
              ))}
            </PsychologistSelect>
            <SelectButton
              onClick={handleSelectPsychologist}
              isLoading={loadingPsychologists}
            >
              Assign
            </SelectButton>
          </SelectContainer>
        </InfoSection>
      </VStack>
    </PageContainer>
  );
};
