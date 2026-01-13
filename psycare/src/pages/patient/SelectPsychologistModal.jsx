import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Select,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";

export const SelectPsychologistModal = ({
  isOpen,
  onClose,
  patientId,
  onAssigned,
}) => {
  const toast = useToast();

  const [psychologists, setPsychologists] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch psychologists when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchPsychologists = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          "http://localhost:5075/Psychologists/get-all"
        );

        if (!response.ok) {
          throw new Error("Failed to load psychologists");
        }

        const data = await response.json();
        setPsychologists(data);
      } catch (error) {
        toast({
          title: "Error loading psychologists",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPsychologists();
  }, [isOpen, toast]);

  const handleAssign = async () => {
    if (!selectedEmail) {
      toast({
        title: "Please select a psychologist",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      setIsAssigning(true);

      const response = await fetch(
        `http://localhost:5075/Patients/${patientId}/assign-psychologist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ psychologistEmail: selectedEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign psychologist");
      }

      toast({
        title: "Psychologist assigned",
        status: "success",
        duration: 2000,
      });

      setSelectedEmail("");
      onAssigned(); // parent refresh + close
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent width="500px" height="300px">
        <ModalHeader>Select Psychologist</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {isLoading ? (
              <Spinner alignSelf="center" />
            ) : (
              <Select
                placeholder="Choose a psychologist..."
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                {psychologists.map((psych) => (
                  <option key={psych.id} value={psych.email}>
                    {psych.name} ({psych.email})
                  </option>
                ))}
              </Select>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleAssign}
            isLoading={isAssigning}
            isDisabled={isLoading}
          >
            Assign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
