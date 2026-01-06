import styled from "@emotion/styled";
import { Box, Button, Input, Text } from "@chakra-ui/react";

export const StyledContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6b46c1, #805ad5);
`;

export const LoginCard = styled(Box)`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

export const Title = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  color: #2d3748;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 16px;
  height: 44px;
  border-radius: 8px;
`;

export const LoginButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  background-color: #6b46c1;
  color: white;
  font-weight: 500;

  &:hover {
    background-color: #553c9a;
  }
`;
