import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  ModalInput,
  PrimaryButton,
  SecondaryButton,
} from "../StyledComponents";

export const AddPatientModal = ({ isOpen, onClose, onAdd }) => {
  const [patientEmail, setPatientEmail] = useState("");

  const handleSubmit = () => {
    onAdd(patientEmail);
    setPatientEmail("");
  };

  const handleClose = () => {
    setPatientEmail("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Existing Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Patient Email</FormLabel>
              <ModalInput
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="Enter patient email"
              />
            </FormControl>

            <HStack spacing={3} width="100%" pt={4}>
              <PrimaryButton
                onClick={handleSubmit}
                width="full"
                isDisabled={!patientEmail}
              >
                Add Patient
              </PrimaryButton>
              <SecondaryButton onClick={handleClose} width="full">
                Cancel
              </SecondaryButton>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
