import { Routes, Route } from "react-router";
import { LandingPage } from "./components/lobby/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
