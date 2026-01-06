import { useState } from "react";
import {
  StyledContainer,
  LoginCard,
  Title,
  StyledInput,
  LoginButton,
} from "./StyledComponents";
import { Text } from "@chakra-ui/react";

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <StyledContainer>
      <LoginCard>
        <Title>{isRegister ? "Create Account" : "Login"}</Title>

        {isRegister && <StyledInput type="text" placeholder="Full Name" />}

        <StyledInput type="email" placeholder="Email" />

        <StyledInput type="password" placeholder="Password" />

        <LoginButton>{isRegister ? "Register" : "Login"}</LoginButton>

        <Text
          mt="16px"
          textAlign="center"
          fontSize="sm"
          cursor="pointer"
          color="purple.500"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don’t have an account? Register"}
        </Text>
      </LoginCard>
    </StyledContainer>
  );
};
