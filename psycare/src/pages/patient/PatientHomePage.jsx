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
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const toast = useToast();

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
                Across {moodStats.total} {moodStats.total === 1 ? "entry" : "entries"}
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
                {moodStats.last ? formatDate(moodStats.last.createdAt) : "No entries yet"}
              </StatHelper>
            </StatCard>
          </MoodStatsGrid>

          <MoodChart>
            <ChartTitle>Last 7 entries</ChartTitle>
            {chartData.length === 0 ? (
              <EmptyMessage>No data to chart yet.</EmptyMessage>
            ) : (
              <Box>
                <ChartSvg viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}>
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
                      <ChartBarLabel as="text" x={p.x} y={chartPoints.height - 6}>
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
                      <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
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
    </PageContainer>
  );
};
