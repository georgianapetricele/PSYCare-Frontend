import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { PatientPage } from "./pages/patient/PatientHomePage";
import { PsychologistPage } from "./pages/psychologist/PsychologistHomePage";
import { PatientDetailsPage } from "./pages/psychologist/components/PatientDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/psychologist" element={<PsychologistPage />} />
        <Route path="/patient/:patientId" element={<PatientDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
