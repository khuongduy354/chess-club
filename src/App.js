// Setup
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
// Socket
// Components
import Demo from "./components/chess/Demo";
import Room from "./components/room/Room";
import JoinRoom from "./components/room/JoinRoom";

import { _global } from "./_global";
function App() {
  const [playBlack, setPlayBlack] = useState(true);
  const [renderMode, setRenderMode] = useState(true);
  const renderSelection = () => {
    return (
      <div>
        <button
          onClick={() => {
            const option = window.prompt("Play black? (Y/N)");
            if (!option) return alert("Enter choice");
            setPlayBlack((option.toLowerCase() || option) == "y");
            setRenderMode(false);
          }}
        >
          Play AI
        </button>
        <button
          onClick={() => {
            window.location.replace(_global.CLIENT_URL + "/enter-room");
          }}
          s
        >
          Play PvP
        </button>
      </div>
    );
  };
  const RenderHome = () => {
    return (
      <div>
        {renderMode && renderSelection()}
        {!renderMode && <Demo playerColor={playBlack ? "black" : "white"} />}
      </div>
    );
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<RenderHome />} />
        <Route path="enter-room" element={<JoinRoom />} />
        <Route path="room/:roomName/:userName" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
