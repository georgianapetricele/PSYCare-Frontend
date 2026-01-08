import styled from "@emotion/styled";
import { Box, Button, Container, Heading, Text, Input } from "@chakra-ui/react";

export const PageContainer = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`;

export const HeaderBox = styled(Box)`
  margin-bottom: 24px;
`;

export const WelcomeHeading = styled(Heading)`
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 8px;
`;

export const InfoText = styled(Text)`
  color: #718096;
  font-size: 14px;
`;

export const SectionBox = styled(Box)`
  margin-top: 24px;
`;

export const SectionHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionTitle = styled(Heading)`
  font-size: 20px;
  color: #2d3748;
`;

export const AddButton = styled(Button)`
  background-color: #6b46c1;
  color: white;
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
  font-weight: 500;

  &:hover {
    background-color: #553c9a;
  }
`;

export const PatientCardBox = styled(Box)`
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const PatientInfo = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const PatientDetails = styled(Box)`
  flex: 1;
`;

export const PatientName = styled(Text)`
  font-weight: 600;
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 8px;
`;

export const PatientDetailText = styled(Text)`
  font-size: 14px;
  color: #718096;
  margin-bottom: 4px;
`;

export const DeleteButton = styled(Button)`
  background-color: #e53e3e;
  color: white;
  border-radius: 8px;
  padding: 0 16px;
  height: 36px;
  font-size: 14px;

  &:hover {
    background-color: #c53030;
  }
`;

export const LoadingText = styled(Text)`
  color: #718096;
  text-align: center;
  padding: 40px;
`;

export const EmptyStateText = styled(Text)`
  color: #a0aec0;
  text-align: center;
  padding: 40px;
  font-size: 16px;
`;

export const ModalInput = styled(Input)`
  height: 44px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const ModalButton = styled(Button)`
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
`;

export const PrimaryButton = styled(ModalButton)`
  background-color: #6b46c1;
  color: white;

  &:hover {
    background-color: #553c9a;
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(ModalButton)`
  background-color: #e2e8f0;
  color: #2d3748;

  &:hover {
    background-color: #cbd5e0;
  }
`;
