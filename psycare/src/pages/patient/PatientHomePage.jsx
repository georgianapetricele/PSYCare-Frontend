import { useState, useEffect, useMemo } from "react";
import {
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Textarea,
  Input,
  HStack,
  Box,
  Button,
} from "@chakra-ui/react";
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
  SectionHeader,
  SecondaryTextButton,
  MoodEntries,
  MoodCard,
  MoodScore,
  MoodMeta,
  MoodNote,
  EmojiTag,
  EmojiPickerGrid,
  EmojiButton,
  MoodStatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatHelper,
  MoodChart,
  ChartTitle,
  ChartSvg,
  ChartLine,
  ChartPath,
  ChartDot,
  ChartDotLabel,
  ChartBarLabel,
  CrisisButton,
  CrisisNote,
  SessionsSection,
  SessionCard,
  SessionHeader,
  SessionDate,
  SessionStatus,
  SessionDetails,
  CalendarButton,
} from "./StyledComponents";

export const PatientPage = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [selectedPsychologistEmail, setSelectedPsychologistEmail] =
    useState("");
  const [loadingPsychologists, setLoadingPsychologists] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [moodValue, setMoodValue] = useState(5);
  const [moodNotes, setMoodNotes] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [moodEntries, setMoodEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loadingMoods, setLoadingMoods] = useState(false);
  const [crisisActive, setCrisisActive] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const toast = useToast();
  const [sessions, setSessions] = useState([]);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  const emojiOptions = [
    { value: "😞", label: "Low" },
    { value: "😐", label: "Neutral" },
    { value: "🙂", label: "Okay" },
    { value: "😊", label: "Good" },
    { value: "🤩", label: "Great" },
  ];

  // Fetch psychologists and mood entries on component mount
  useEffect(() => {
    fetchPsychologists();
    fetchMoodEntries();
    fetchSessions();
    fetchJournals();
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

  const fetchMoodEntries = async () => {
    try {
      setLoadingMoods(true);
      const response = await fetch(
        `http://localhost:5075/Patients/${user.data.id}/moods`
      );
      if (response.ok) {
        const data = await response.json();
        setMoodEntries(data);
      }
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      toast({
        title: "Error loading mood entries",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingMoods(false);
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

  const handleOpenMoodModal = (entry = null) => {
    if (entry) {
      setMoodValue(Number(entry.score) || 5);
      setMoodNotes(entry.notes || "");
      setAudioUrl(entry.audioUrl || "");
      setSelectedEmoji(entry.emoji || "");
      setEditingEntry(entry);
    } else {
      resetMoodForm();
      setEditingEntry(null);
    }
    setIsMoodModalOpen(true);
  };

  const resetMoodForm = () => {
    setMoodValue(5);
    setMoodNotes("");
    setAudioUrl("");
    setSelectedEmoji("");
  };

  const handleCloseMoodModal = () => {
    resetMoodForm();
    setEditingEntry(null);
    setIsMoodModalOpen(false);
  };

  const handleSubmitMood = async () => {
    const payload = {
      score: moodValue,
      notes: moodNotes.trim() || null,
      emoji: selectedEmoji || null,
      audioUrl: audioUrl.trim() || null,
    };

    try {
      let response;
      if (editingEntry) {
        // Update existing entry
        response = await fetch(
          `http://localhost:5075/Patients/${user.data.id}/moods/${editingEntry.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Create new entry
        response = await fetch(
          `http://localhost:5075/Patients/${user.data.id}/moods`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      if (response.ok) {
        toast({
          title: editingEntry ? "Mood updated" : "Mood saved",
          description: editingEntry
            ? "Your mood entry was updated."
            : "Your daily mood entry was added to your record.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        handleCloseMoodModal();
        fetchMoodEntries(); // Refresh list
      } else {
        throw new Error("Failed to save mood entry");
      }
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        title: "Error saving mood",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMood = async (entryId) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Patients/${user.data.id}/moods/${entryId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast({
          title: "Entry deleted",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
        fetchMoodEntries(); // Refresh list
      } else {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting mood:", error);
      toast({
        title: "Error deleting entry",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const moodStats = useMemo(() => {
    if (!moodEntries.length) {
      return {
        total: 0,
        avg: null,
        avg7: null,
        best: null,
        worst: null,
        last: null,
      };
    }

    const values = moodEntries.map((entry) => Number(entry.score) || 0);
    const total = moodEntries.length;
    const avg = values.reduce((sum, val) => sum + val, 0) / total;

    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const last7 = moodEntries.filter(
      (entry) => now - new Date(entry.createdAt).getTime() <= weekMs
    );
    const avg7 =
      last7.length === 0
        ? null
        : last7.reduce((sum, entry) => sum + (Number(entry.score) || 0), 0) /
          last7.length;

    return {
      total,
      avg: Number(avg.toFixed(1)),
      avg7: avg7 === null ? null : Number(avg7.toFixed(1)),
      best: Math.max(...values),
      worst: Math.min(...values),
      last: moodEntries[0],
    };
  }, [moodEntries]);

  const chartData = useMemo(() => {
    const recent = moodEntries.slice(0, 7).reverse();
    return recent.map((entry) => ({
      value: Number(entry.score) || 0,
      label: new Date(entry.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      raw: entry,
    }));
  }, [moodEntries]);

  const chartPoints = useMemo(() => {
    if (!chartData.length) return { points: [], path: "", gridY: [] };

    const width = 320;
    const height = 180;
    const padX = 32;
    const padY = 18;
    const minVal = 1;
    const maxVal = 10;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    const scaleX = (idx) =>
      chartData.length === 1
        ? width / 2
        : padX + (idx / (chartData.length - 1)) * usableW;
    const scaleY = (val) =>
      padY + (1 - (val - minVal) / (maxVal - minVal)) * usableH;

    const points = chartData.map((item, idx) => ({
      ...item,
      x: scaleX(idx),
      y: scaleY(item.value),
    }));

    const path = points
      .map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ");

    const gridY = [10, 8, 6, 4, 2].map((val) => ({
      y: scaleY(val),
      label: val,
    }));

    return { points, path, gridY, width, height, padX, padY };
  }, [chartData]);

  const handleCrisis = async () => {
    try {
      if (!user.data.psychologistId) {
        toast({
          title: "No psychologist assigned",
          description: "Please select a psychologist first.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await fetch(
        `http://localhost:5075/Crisis/crisis/${user.data.id}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast({
          title: "Crisis alert sent!",
          description: "Your psychologist has been notified.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setCrisisActive(true);
      } else {
        throw new Error("Failed to send crisis alert");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await fetch(
        `http://localhost:5075/Sessions/patient/${user.data.id}`
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

  const handleOpenSessionModal = () => {
    setSessionDate("");
    setSessionTime("");
    setSessionNotes("");
    setIsSessionModalOpen(true);
  };

  const handleCloseSessionModal = () => {
    setSessionDate("");
    setSessionTime("");
    setSessionNotes("");
    setIsSessionModalOpen(false);
  };

  const handleScheduleSession = async () => {
    if (!sessionDate || !sessionTime) {
      toast({
        title: "Please select date and time",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const scheduledDateTime = new Date(`${sessionDate}T${sessionTime}`);

    const payload = {
      patientId: user.data.id,
      psychologistId: 1, // Placeholder, to be replaced with corresponding psychologist ID  (user.data.psychologistId)
      scheduledAt: scheduledDateTime.toISOString(),
      notes: sessionNotes.trim() || null,
      status: "pending",
    };

    try {
      const response = await fetch("http://localhost:5075/Sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Session scheduled",
          description: "Your psychologist will review and confirm the session.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleCloseSessionModal();
        fetchSessions();
      } else {
        throw new Error("Failed to schedule session");
      }
    } catch (error) {
      console.error("Error scheduling session:", error);
      toast({
        title: "Error scheduling session",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancelSession = async (sessionId) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Sessions/${sessionId}/cancel`,
        { method: "PUT" }
      );

      if (response.ok) {
        toast({
          title: "Session cancelled",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
        fetchSessions();
      } else {
        throw new Error("Failed to cancel session");
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast({
        title: "Error cancelling session",
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

  const generateGoogleCalendarUrl = (
    session,
    patientName,
    psychologistEmail
  ) => {
    const startDate = new Date(session.scheduledAt);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour session

    // Format dates to Google Calendar format (YYYYMMDDTHHMMSSZ)
    const formatDateForGoogle = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Therapy Session with ${psychologistEmail}`,
      dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(
        endDate
      )}`,
      details: session.notes ? `Notes: ${session.notes}` : "Therapy session",
      location: "Online/Video Call", // Customize as needed
      trp: "false", // Don't show suggestions
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const handleAddToCalendar = (session) => {
    const calendarUrl = generateGoogleCalendarUrl(
      session,
      user.data.name,
      user.data.psychologistEmail
    );
    window.open(calendarUrl, "_blank");
  };

  // journal functionalities
  const fetchJournals = async () => {
    try {
      setLoadingJournals(true);
      const response = await fetch(
        `http://localhost:5075/Patients/${user.data.id}/journals`
      );
      if (response.ok) {
        const data = await response.json();
        setJournals(data);
      }
    } catch (error) {
      toast({
        title: "Error loading journals",
        status: "error",
        description: error.message,
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingJournals(false);
    }
  };

  const handleOpenJournalModal = (entry = null) => {
    if (entry) {
      setEditingJournal(entry);
      setJournalText(entry.text || "");
    } else {
      setEditingJournal(null);
      setJournalText("");
    }
    setIsJournalModalOpen(true);
  };

  const handleCloseJournalModal = () => {
    setEditingJournal(null);
    setJournalText("");
    setIsJournalModalOpen(false);
  };

  const handleSubmitJournal = async () => {
    const payload = { text: journalText.trim() || null };

    try {
      const url = editingJournal
        ? `http://localhost:5075/Patients/${user.data.id}/journals/${editingJournal.id}`
        : `http://localhost:5075/Patients/${user.data.id}/journals`;

      const method = editingJournal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save journal entry");

      toast({
        title: editingJournal ? "Journal updated" : "Journal saved",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      handleCloseJournalModal();
      fetchJournals();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteJournal = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5075/Patients/${user.data.id}/journal/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error();

      toast({
        title: "Entry deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      fetchJournals();
    } catch {
      toast({
        title: "Error deleting entry",
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

        {user.data.psychologistId && (
          <InfoSection>
            <SectionHeader>
              <SectionTitle>Your Sessions</SectionTitle>
              <SecondaryTextButton onClick={handleOpenSessionModal}>
                Schedule session
              </SecondaryTextButton>
            </SectionHeader>

            <SessionsSection>
              {loadingSessions ? (
                <EmptyMessage>Loading sessions...</EmptyMessage>
              ) : sessions.length === 0 ? (
                <EmptyMessage>
                  No sessions scheduled yet. Click "Schedule session" to request
                  a time with your psychologist.
                </EmptyMessage>
              ) : (
                sessions.map((session) => (
                  <SessionCard key={session.id}>
                    <SessionHeader>
                      <SessionDate>
                        {formatSessionDateTime(session.scheduledAt)}
                      </SessionDate>
                      <SessionStatus data-status={session.status}>
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </SessionStatus>
                    </SessionHeader>
                    {session.notes && (
                      <SessionDetails>Notes: {session.notes}</SessionDetails>
                    )}
                    {session.status === "pending" && (
                      <HStack mt={2}>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleOpenSessionModal(session)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleCancelSession(session.id)}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    )}

                    {session.status === "confirmed" && (
                      <HStack mt={2}>
                        <CalendarButton
                          size="xs"
                          onClick={() => handleAddToCalendar(session)}
                        >
                          📅 Add to Google Calendar
                        </CalendarButton>
                      </HStack>
                    )}
                  </SessionCard>
                ))
              )}
            </SessionsSection>
          </InfoSection>
        )}

        {/* Mood Tracking Section */}
        <InfoSection>
          <SectionHeader>
            <SectionTitle>Mood Tracking</SectionTitle>
            <SecondaryTextButton onClick={() => handleOpenMoodModal()}>
              Track today
            </SecondaryTextButton>
          </SectionHeader>

          <MoodStatsGrid>
            <StatCard>
              <StatLabel>Average mood</StatLabel>
              <StatValue>{moodStats.avg ?? "—"}</StatValue>
              <StatHelper>
                Across {moodStats.total}{" "}
                {moodStats.total === 1 ? "entry" : "entries"}
              </StatHelper>
            </StatCard>
            <StatCard>
              <StatLabel>Last 7 days</StatLabel>
              <StatValue>{moodStats.avg7 ?? "—"}</StatValue>
              <StatHelper>
                Best {moodStats.best ?? "—"} • Lowest {moodStats.worst ?? "—"}
              </StatHelper>
            </StatCard>
            <StatCard>
              <StatLabel>Latest entry</StatLabel>
              <StatValue>
                {moodStats.last ? moodStats.last.score : "—"}
                {moodStats.last?.emoji ? ` ${moodStats.last.emoji}` : ""}
              </StatValue>
              <StatHelper>
                {moodStats.last
                  ? formatDate(moodStats.last.createdAt)
                  : "No entries yet"}
              </StatHelper>
            </StatCard>
          </MoodStatsGrid>

          <MoodChart>
            <ChartTitle>Last 7 entries</ChartTitle>
            {chartData.length === 0 ? (
              <EmptyMessage>No data to chart yet.</EmptyMessage>
            ) : (
              <Box>
                <ChartSvg
                  viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}
                >
                  {chartPoints.gridY.map((g, idx) => (
                    <ChartLine
                      key={`grid-${idx}`}
                      x1={chartPoints.padX}
                      x2={chartPoints.width - chartPoints.padX}
                      y1={g.y}
                      y2={g.y}
                    />
                  ))}
                  <ChartPath d={chartPoints.path} />
                  {chartPoints.points.map((p, idx) => (
                    <g key={`pt-${idx}`}>
                      <ChartDot cx={p.x} cy={p.y} />
                      <ChartDotLabel as="text" x={p.x} y={p.y - 12}>
                        {p.value}
                      </ChartDotLabel>
                      <ChartBarLabel
                        as="text"
                        x={p.x}
                        y={chartPoints.height - 6}
                      >
                        {p.label}
                      </ChartBarLabel>
                    </g>
                  ))}
                </ChartSvg>
              </Box>
            )}
          </MoodChart>

          {loadingMoods ? (
            <EmptyMessage>Loading mood entries...</EmptyMessage>
          ) : moodEntries.length === 0 ? (
            <EmptyMessage>
              No mood entries yet. Log today&apos;s mood to start your streak.
            </EmptyMessage>
          ) : (
            <MoodEntries>
              {moodEntries.map((entry) => (
                <MoodCard key={entry.id}>
                  <HStack align="center" justify="space-between">
                    <MoodScore>{entry.score}</MoodScore>
                    <Box flex="1">
                      <HStack
                        justify="space-between"
                        align="center"
                        flexWrap="wrap"
                        gap={2}
                      >
                        <MoodMeta>
                          {formatDate(entry.createdAt)}
                          {entry.emoji && <EmojiTag>{entry.emoji}</EmojiTag>}
                        </MoodMeta>
                        <HStack spacing={2}>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleOpenMoodModal(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteMood(entry.id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </HStack>
                      {entry.audioUrl && (
                        <MoodMeta mt={1}>Audio note: {entry.audioUrl}</MoodMeta>
                      )}
                      {entry.notes && <MoodNote>{entry.notes}</MoodNote>}
                    </Box>
                  </HStack>
                </MoodCard>
              ))}
            </MoodEntries>
          )}
        </InfoSection>
      </VStack>

      {/* Mood Modal */}
      {isMoodModalOpen && (
        <Modal
          isOpen={isMoodModalOpen}
          onClose={handleCloseMoodModal}
          size="lg"
          closeOnEsc
          closeOnOverlayClick
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Log today&apos;s mood</ModalHeader>
            <ModalCloseButton onClick={handleCloseMoodModal} />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Mood (1-10)</FormLabel>
                  <Box px={1}>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={moodValue}
                      onChange={setMoodValue}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb fontSize="sm" boxSize={7}>
                        {moodValue}
                      </SliderThumb>
                    </Slider>
                    <HStack justify="space-between" fontSize="12px" mt={2}>
                      <Box color="#718096">1</Box>
                      <Box color="#718096">10</Box>
                    </HStack>
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel>Emoji (optional)</FormLabel>
                  <EmojiPickerGrid>
                    {emojiOptions.map((option) => (
                      <EmojiButton
                        key={option.value}
                        onClick={() =>
                          setSelectedEmoji(
                            selectedEmoji === option.value ? "" : option.value
                          )
                        }
                        data-selected={selectedEmoji === option.value}
                      >
                        {option.value}
                      </EmojiButton>
                    ))}
                  </EmojiPickerGrid>
                </FormControl>

                <FormControl>
                  <FormLabel>Notes (optional)</FormLabel>
                  <Textarea
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    placeholder="Add context, triggers, or wins from today"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Audio link (optional)</FormLabel>
                  <Input
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="Paste a link to a short audio note"
                  />
                </FormControl>

                <HStack pt={2} justify="flex-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseMoodModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    colorScheme="purple"
                    onClick={handleSubmitMood}
                  >
                    Save entry
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {isSessionModalOpen && (
        <Modal
          isOpen={isSessionModalOpen}
          onClose={handleCloseSessionModal}
          size="lg"
          closeOnEsc
          closeOnOverlayClick
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Schedule a session</ModalHeader>
            <ModalCloseButton onClick={handleCloseSessionModal} />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Notes (optional)</FormLabel>
                  <Textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Any specific topics or concerns you'd like to discuss?"
                  />
                </FormControl>

                <HStack pt={2} justify="flex-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseSessionModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    colorScheme="purple"
                    onClick={handleScheduleSession}
                  >
                    Request session
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Journal entries */}
      <InfoSection>
        <SectionHeader>
          <SectionTitle>Journal</SectionTitle>
          <SecondaryTextButton onClick={() => handleOpenJournalModal()}>
            Add entry
          </SecondaryTextButton>
        </SectionHeader>

        {loadingJournals ? (
          <EmptyMessage>Loading journals...</EmptyMessage>
        ) : journals.length === 0 ? (
          <EmptyMessage>No journal entries yet.</EmptyMessage>
        ) : (
          <MoodEntries>
            {journals.map((entry) => (
              <MoodCard key={entry.id}>
                <HStack justify="space-between" align="center">
                  <MoodMeta>{formatDate(entry.createdAt)}</MoodMeta>
                  <HStack>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleOpenJournalModal(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteJournal(entry.id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
                {entry.text && <MoodNote>{entry.text}</MoodNote>}
              </MoodCard>
            ))}
          </MoodEntries>
        )}
      </InfoSection>

      {/* Journal Modal */}
      {isJournalModalOpen && (
        <Modal isOpen onClose={handleCloseJournalModal} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Journal Entry</ModalHeader>
            <ModalCloseButton onClick={handleCloseJournalModal} />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Write your thoughts..."
                  minH="180px"
                />
                <HStack justify="flex-end">
                  <Button variant="outline" onClick={handleCloseJournalModal}>
                    Cancel
                  </Button>
                  <Button colorScheme="purple" onClick={handleSubmitJournal}>
                    Save
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {user.data.psychologistId && (
        <InfoSection>
          <CrisisButton disabled={crisisActive} onClick={handleCrisis}>
            {crisisActive ? "🚨 Alert sent" : "🚨 CRISIS"}
          </CrisisButton>

          <CrisisNote>
            Your psychologist will be notified immediately and will call you as
            soon as possible.
          </CrisisNote>
        </InfoSection>
      )}
    </PageContainer>
  );
};
