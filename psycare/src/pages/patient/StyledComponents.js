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

export const SectionHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SecondaryTextButton = styled(Button)`
  background: #edf2f7;
  color: #2d3748;
  border-radius: 8px;
  padding: 0 16px;
  height: 38px;
  font-weight: 600;

  &:hover {
    background: #e2e8f0;
  }
`;

export const MoodEntries = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
`;

export const MoodCard = styled(Box)`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const MoodScore = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b46c1, #805ad5);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  margin-right: 10px;
`;

export const MoodMeta = styled(Text)`
  color: #4a5568;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const MoodNote = styled(Text)`
  color: #2d3748;
  font-size: 14px;
  margin-top: 8px;
`;

export const EmojiTag = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f7fafc;
  font-size: 18px;
  line-height: 1.1;
`;

export const EmojiPickerGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
  gap: 8px;
`;

export const EmojiButton = styled(Button)`
  height: 48px;
  font-size: 20px;
  border: 1px solid #e2e8f0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;

  &[data-selected="true"] {
    border-color: #6b46c1;
    box-shadow: 0 0 0 2px rgba(107, 70, 193, 0.15);
  }
`;

export const MoodStatsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

export const StatCard = styled(Box)`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  background: #f9fafb;
`;

export const StatLabel = styled(Text)`
  color: #4a5568;
  font-size: 13px;
  margin-bottom: 6px;
`;

export const StatValue = styled(Heading)`
  font-size: 24px;
  color: #2d3748;
  line-height: 1.1;
`;

export const StatHelper = styled(Text)`
  color: #718096;
  font-size: 12px;
  margin-top: 4px;
`;

export const MoodChart = styled(Box)`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: #f7fafc;
`;

export const ChartTitle = styled(Heading)`
  font-size: 16px;
  color: #2d3748;
  margin-bottom: 10px;
`;

export const ChartBars = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
  gap: 10px;
  align-items: end;
  min-height: 160px;
  background: repeating-linear-gradient(
      to top,
      rgba(226, 232, 240, 0.8),
      rgba(226, 232, 240, 0.8) 1px,
      transparent 1px,
      transparent 28px
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4));
  border-radius: 10px;
  padding: 8px;
`;

export const ChartBar = styled(Box)`
  position: relative;
  background: linear-gradient(180deg, #805ad5 0%, #6b46c1 100%);
  border-radius: 10px 10px 6px 6px;
  min-height: 12px;
  transition: transform 0.15s ease;
  border: 1px solid rgba(64, 43, 109, 0.25);

  &:hover {
    transform: translateY(-2px);
  }
`;

export const ChartBarLabel = styled(Text)`
  text-align: center;
  margin-top: 6px;
  font-size: 11px;
  color: #718096;
`;

export const ChartBarValue = styled(Text)`
  position: absolute;
  top: -22px;
  width: 100%;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #4a5568;
`;

export const ChartSvg = styled.svg`
  width: 100%;
  height: 220px;
  overflow: visible;
`;

export const ChartLine = styled.line`
  stroke: #d0d7e5;
  stroke-width: 1;
`;

export const ChartPath = styled.path`
  fill: none;
  stroke: #a78bfa;
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-linecap: round;
`;

export const ChartDot = styled.circle`
  fill: #6b46c1;
  stroke: #fff;
  stroke-width: 2;
  r: 6;
`;

export const ChartDotLabel = styled(Text)`
  font-size: 11px;
  color: #4a5568;
  text-anchor: middle;
`;

export const CrisisButton = styled(Button)`
  background-color: #ff1a1a;
  color: white;
  border-radius: 10px;
  padding: 0 28px;
  height: 56px;
  font-weight: 700;
  font-size: 18px;
  display: block;
  margin: 0 auto; /* centrare */
  margin-top: 12px;
  margin-bottom: 12px;
  max-width: 320px;
  width: 100%;

  &:hover {
    background-color: #e60000;
  }

  &:active {
    background-color: #cc0000;
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

export const CrisisNote = styled(Text)`
  text-align: center;
  color: #e53e3e;
  font-size: 14px;
  margin-top: 4px;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 500;
`;
