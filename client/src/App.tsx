import { Routes, Route } from "react-router";
import { LandingPage } from "./components/lobby/LandingPage";
import { Lobby } from "./components/lobby/Lobby";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/lobby/:code" element={<Lobby />} />
    </Routes>
  );
}

export default App;
