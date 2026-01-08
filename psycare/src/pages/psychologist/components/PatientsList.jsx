import { Box, VStack } from "@chakra-ui/react";
import { PatientCard } from "./PatientCard";
import {
  SectionBox,
  SectionHeader,
  SectionTitle,
  AddButton,
  LoadingText,
  EmptyStateText,
} from "../StyledComponents";

export const PatientsList = ({ patients, loading, onDelete, onAddClick }) => {
  return (
    <SectionBox>
      <SectionHeader>
        <SectionTitle>My Patients ({patients.length})</SectionTitle>
        <AddButton onClick={onAddClick}>Add Patient</AddButton>
      </SectionHeader>

      {loading ? (
        <LoadingText>Loading patients...</LoadingText>
      ) : patients.length === 0 ? (
        <EmptyStateText>No patients assigned yet.</EmptyStateText>
      ) : (
        <Box>
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </SectionBox>
  );
};
