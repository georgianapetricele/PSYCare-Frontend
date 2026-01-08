import {
  PatientCardBox,
  PatientInfo,
  PatientDetails,
  PatientName,
  PatientDetailText,
  DeleteButton,
} from "../StyledComponents";

export const PatientCard = ({ patient, onDelete }) => {
  return (
    <PatientCardBox>
      <PatientInfo>
        <PatientDetails>
          <PatientName>{patient.name}</PatientName>
          <PatientDetailText>Email: {patient.email}</PatientDetailText>
          <PatientDetailText>Phone: {patient.phoneNumber}</PatientDetailText>
          <PatientDetailText>Age: {patient.age}</PatientDetailText>
          <PatientDetailText>Location: {patient.location}</PatientDetailText>
          <PatientDetailText>
            Issue Description: {patient.issueDescription}
          </PatientDetailText>
        </PatientDetails>
        <DeleteButton onClick={() => onDelete(patient.id)}>Delete</DeleteButton>
      </PatientInfo>
    </PatientCardBox>
  );
};
