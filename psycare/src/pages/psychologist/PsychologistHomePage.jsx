import { useState, useEffect } from "react";
import { Box, VStack, useToast, useDisclosure } from "@chakra-ui/react";
import { PatientsList } from "./components/PatientsList";
import { AddPatientModal } from "./components/AddPatientModal";
import {
  PageContainer,
  HeaderBox,
  WelcomeHeading,
  InfoText,
  SectionBox,
  SectionHeader,
  SectionTitle,
  SessionRequestCard,
  SessionRequestHeader,
  SessionPatientName,
  SessionDateTime,
  SessionNotes,
  SessionActionButtons,
  AcceptButton,
  RejectButton,
  SessionStatusBadge,
  SessionsGrid,
  EmptyStateText,
  LoadingText,
  CalendarButton,  
} from "./StyledComponents";

export const PsychologistPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

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

  useEffect(() => {
      fetchSessions();
      
      // Fetch sessions every 10 minutes
      const interval = setInterval(() => {
        fetchSessions();
      }, 10 * 60 * 1000); // 10 minutes in milliseconds

      return () => clearInterval(interval);
    }, []);

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

    const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await fetch(
        `http://localhost:5075/Sessions/psychologist/${user.data.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error loading sessions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleAcceptSession = async (sessionId) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Sessions/${sessionId}/confirm`,
        { method: "PUT" }
      );

      if (response.ok) {
        toast({
          title: "Session confirmed",
          description: "The patient has been notified.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSessions();
      } else {
        throw new Error("Failed to confirm session");
      }
    } catch (error) {
      console.error("Error confirming session:", error);
      toast({
        title: "Error confirming session",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRejectSession = async (sessionId) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Sessions/${sessionId}/cancel`,
        { method: "PUT" }
      );

      if (response.ok) {
        toast({
          title: "Session rejected",
          description: "The patient has been notified.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        fetchSessions();
      } else {
        throw new Error("Failed to reject session");
      }
    } catch (error) {
      console.error("Error rejecting session:", error);
      toast({
        title: "Error rejecting session",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatSessionDateTime = (isoString) => {
    return new Date(isoString).toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
  };

  const generateGoogleCalendarUrl = (session, patientName) => {
    const startDate = new Date(session.scheduledAt);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatDateForGoogle = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Therapy Session with ${patientName}`,
      dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
      details: session.notes ? `Notes: ${session.notes}` : 'Therapy session',
      location: 'Online/Video Call',
      trp: 'false'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Add handler
  const handleAddToCalendar = (session, patientName) => {
    const calendarUrl = generateGoogleCalendarUrl(session, patientName);
    window.open(calendarUrl, '_blank');
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

      <SectionBox>
        <SectionHeader>
          <SectionTitle>Session Requests</SectionTitle>
        </SectionHeader>

        {loadingSessions ? (
          <LoadingText>Loading session requests...</LoadingText>
        ) : sessions.length === 0 ? (
          <EmptyStateText>No session requests at the moment.</EmptyStateText>
        ) : (
          <SessionsGrid>
            {sessions.map((session) => {
              const patient = patients.find(p => p.id === session.patientId);
              return (
                <SessionRequestCard key={session.id}>
                  <SessionRequestHeader>
                    <Box>
                      <SessionPatientName>
                        {patient?.name || "Unknown Patient"}
                      </SessionPatientName>
                      <SessionDateTime>
                        📅 {formatSessionDateTime(session.scheduledAt)}
                      </SessionDateTime>
                      {patient?.email && (
                        <InfoText>📧 {patient.email}</InfoText>
                      )}
                    </Box>
                    <SessionStatusBadge data-status={session.status}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </SessionStatusBadge>
                  </SessionRequestHeader>

                  {session.notes && (
                    <SessionNotes>Notes: {session.notes}</SessionNotes>
                  )}

                  {session.status === "pending" && (
                    <SessionActionButtons>
                      <AcceptButton onClick={() => handleAcceptSession(session.id)}>
                        Accept
                      </AcceptButton>
                      <RejectButton onClick={() => handleRejectSession(session.id)}>
                        Reject
                      </RejectButton>
                    </SessionActionButtons>
                  )}

                  {session.status === "confirmed" && (
                    <SessionActionButtons>
                      <CalendarButton onClick={() => handleAddToCalendar(session, patient?.name || "Patient")}>
                        📅 Add to Google Calendar
                      </CalendarButton>
                    </SessionActionButtons>
                  )}
                </SessionRequestCard>
              );
            })}
          </SessionsGrid>
        )}
      </SectionBox>
    </PageContainer>
  );
};
