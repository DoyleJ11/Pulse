import { Routes, Route } from "react-router";
import { LandingPage } from "./components/lobby/LandingPage";
import { Lobby } from "./components/lobby/Lobby";
import { SongSearch } from "./components/picking/SongSearch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/lobby/:code" element={<Lobby />} />
      <Route path="/search" element={<div className="h-screen flex items-center justify-center p-6"><SongSearch /></div>} />
    </Routes>
  );
}

export default App;
