import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { PacientPage } from "./pages/pacient/PacientHomePage";
import { PsychologistPage } from "./pages/psychologist/PsychologistHomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/pacient" element={<PacientPage />} />
        <Route path="/psychologist" element={<PsychologistPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
