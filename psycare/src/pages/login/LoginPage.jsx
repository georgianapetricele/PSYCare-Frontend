import { useState } from "react";
import {
  StyledContainer,
  LoginCard,
  Title,
  StyledInput,
  LoginButton,
} from "./StyledComponents";
import { Text, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  // common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  // patient-only fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [age, setAge] = useState("");

  // LOGIN
  const handleLogin = async () => {
    const res = await fetch("http://localhost:5075/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Incorrect email or password");
      return;
    }

    const user = await res.json();

    // salvează current user în localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));

    // redirect pe pagina corectă
    if (user.role === "patient") navigate("/patient");
    else navigate("/psychologist");
  };

  // REGISTER
  const handleRegister = async () => {
    let url = "";
    let body = {};

    if (role === "patient") {
      url = "http://localhost:5075/Patients/add-patient";
      body = {
        name,
        email,
        password,
        phoneNumber,
        location,
        issueDescription,
        age: Number(age),
      };
    } else {
      url = "http://localhost:5075/Psychologists/add-psychologist";
      body = {
        name,
        email,
        password,
        location,
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Error creating account");
      return;
    }

    // preluăm user-ul creat (dacă backend-ul îl returnează)
    const user = await res.json();

    // salvăm current user
    localStorage.setItem("currentUser", JSON.stringify(user));

    // redirect direct la pagina corespunzătoare
    if (role === "patient") navigate("/patient");
    else navigate("/psychologist");
  };

  return (
    <StyledContainer>
      <LoginCard>
        <Title>{isRegister ? "Create Account" : "Login"}</Title>

        {/* REGISTER */}
        {isRegister && (
          <>
            <Select
              mb="12px"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="psychologist">Psychologist</option>
            </Select>

            <StyledInput
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <StyledInput
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledInput
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Patient extra */}
        {isRegister && role === "patient" && (
          <>
            <StyledInput
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <StyledInput
              placeholder="Location"
              onChange={(e) => setLocation(e.target.value)}
            />
            <StyledInput
              placeholder="Issue Description"
              onChange={(e) => setIssueDescription(e.target.value)}
            />
            <StyledInput
              type="number"
              placeholder="Age"
              onChange={(e) => setAge(e.target.value)}
            />
          </>
        )}

        {/* Psychologist extra */}
        {isRegister && role === "psychologist" && (
          <StyledInput
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        )}

        <LoginButton onClick={isRegister ? handleRegister : handleLogin}>
          {isRegister ? "Register" : "Login"}
        </LoginButton>

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
