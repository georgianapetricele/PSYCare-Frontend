import { useNavigate } from "react-router-dom";
import {
  PatientCardBox,
  PatientInfo,
  PatientDetails,
  PatientName,
  PatientDetailText,
  DeleteButton,
  AddButton,
} from "../StyledComponents";
import { Box } from "@chakra-ui/react";

export const PatientCard = ({ patient, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${patient.name}? This action cannot be undone.`
    );

    if (confirm) {
      onDelete(patient.id);
    }
  };

  return (
    <PatientCardBox>
      <PatientInfo>
        <PatientDetails>
          <PatientDetailText>Patient Name: {patient.name}</PatientDetailText>
          <PatientDetailText>
            Issue Description: {patient.issueDescription}
          </PatientDetailText>
        </PatientDetails>

        <Box display="flex" gap={2} mt={2}>
          <AddButton
            onClick={() => navigate(`/patient/${patient.id}`)}
            colorScheme="blue"
          >
            See Details
          </AddButton>
          <DeleteButton onClick={handleDelete} colorScheme="red">
            Delete
          </DeleteButton>
        </Box>
      </PatientInfo>
    </PatientCardBox>
  );
};
