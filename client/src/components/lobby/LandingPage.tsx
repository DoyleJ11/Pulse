import { useState } from "react";
import { createRoom, joinRoom } from "../../services/api";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore } from "../../stores/roomStore";
import { useTokenStore } from "../../stores/tokenStore";
import { useToastStore } from "../../stores/toastStore";

function LandingPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const persistedName = useAuthStore((state) => state.name);
  const setToken = useTokenStore((state) => state.setToken);
  const setRoomCode = useRoomStore((state) => state.setCode);
  const addError = useToastStore((state) => state.addError);
  const [name, setName] = useState(persistedName);
  const [code, setCode] = useState("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createRoom(name);
      setAuth(response.name, response.role, response.id);
      setToken(response.jwt);
      setRoomCode(response.code);
      navigate(`/lobby/${response.code}`);
    } catch (error) {
      addError(error, "Could not create the room. Please try again.");
    }
  };

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await joinRoom(name, code);
      setAuth(response.name, response.role, response.id);
      setToken(response.jwt);
      setRoomCode(response.code);
      navigate(`/lobby/${response.code}`);
    } catch (error) {
      addError(error, "Could not join the room. Please check the code and try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-12">
      <label className="h-16 flex flex-col mt-6">
        Name
        <input
          type="text"
          id="nameInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
      </label>
      <div className="h-full w-full flex items-center justify-center gap-16 mb-8 px-6">
        <div className="flex flex-col items-center justify-center h-full w-full border text-center">
          <form id="createForm" onSubmit={handleCreate}>
            <h1 className="text-xl text-blue-500 font-bold m-4">
              Create a new room
            </h1>
            <button
              type="submit"
              className="border rounded-md p-2 cursor-pointer"
            >
              Create Room
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center h-full w-full border text-center">
          <form id="joinForm" onSubmit={handleJoin} className="flex flex-col">
            <h1 className="text-xl text-red-500 font-bold m-4">Join a room</h1>
            <input
              type="text"
              id="codeInput"
              placeholder="Room code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 mb-4"
            />
            <button
              type="submit"
              className="border rounded-md p-2 cursor-pointer"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { LandingPage };
