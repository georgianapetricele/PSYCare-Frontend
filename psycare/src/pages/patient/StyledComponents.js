import styled from "@emotion/styled";
import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";

export const PageContainer = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`;

export const HeaderBox = styled(Box)`
  margin-bottom: 32px;
`;

export const WelcomeHeading = styled(Heading)`
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 16px;
`;

export const InfoSection = styled(Box)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled(Heading)`
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 16px;
`;

export const InfoText = styled(Text)`
  color: #718096;
  font-size: 14px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: #2d3748;
`;

export const PsychologistCard = styled(Box)`
  background: linear-gradient(135deg, #6b46c1, #805ad5);
  border-radius: 12px;
  padding: 24px;
  color: white;
  margin-bottom: 24px;
`;

export const PsychologistName = styled(Heading)`
  font-size: 22px;
  color: white;
  margin-bottom: 12px;
`;

export const PsychologistInfo = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SelectButton = styled(Button)`
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

export const PsychologistSelect = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6b46c1;
    box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
  }

  option {
    color: #2d3748;
  }
`;

export const SelectContainer = styled(Box)`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

export const EmptyMessage = styled(Text)`
  color: #a0aec0;
  font-style: italic;
  padding: 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 8px;
`;
