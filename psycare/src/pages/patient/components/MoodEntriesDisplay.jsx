import { useState, useEffect, useMemo } from "react";
import { Box, HStack, Button, useToast } from "@chakra-ui/react";
import {
  SectionBox,
  SectionHeader,
  SectionTitle,
  LoadingText,
  EmptyStateText,
  MoodEntries,
  MoodCard,
  MoodScore,
  MoodMeta,
  MoodNote,
  EmojiTag,
  MoodStatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatHelper,
} from "../StyledComponents";
import { MoodChartDisplay } from "./MoodChartDisplay";

export const MoodEntriesDisplay = ({
  patientId,
  showActions = false,
  onEdit = null,
  onDelete = null,
  showChart = true,
  showStats = true,
}) => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchMoodEntries();
  }, [patientId]);

  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5075/Patients/${patientId}/moods`
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
      setLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleDelete = async (entryId) => {
    if (onDelete) {
      await onDelete(entryId);
      fetchMoodEntries();
    }
  };

  const handleEdit = (entry) => {
    if (onEdit) {
      onEdit(entry);
    }
  };

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

  return (
    <SectionBox>
      <SectionHeader>
        <SectionTitle>Mood History</SectionTitle>
      </SectionHeader>

      {loading ? (
        <LoadingText>Loading mood entries...</LoadingText>
      ) : moodEntries.length === 0 ? (
        <EmptyStateText>No mood entries recorded yet.</EmptyStateText>
      ) : (
        <>
          {showStats && (
            <MoodStatsGrid style={{ marginBottom: "16px" }}>
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
          )}

          {showChart && <MoodChartDisplay moodEntries={moodEntries} />}

          <MoodEntries style={{ marginTop: "16px" }}>
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
                      {showActions && (
                        <HStack spacing={2}>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleEdit(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(entry.id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      )}
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
        </>
      )}
    </SectionBox>
  );
};
