import React, { useRef, useState } from "react";
import { useEffect } from "react";

import socket from "./Socket";
import { useParams } from "react-router-dom";

import { Chat } from "./Chat";
import MoveValidator from "../chess/integrations/MoveValidator";

import Timer from "./timer";
import { _global } from "../../_global";
const Room = () => {
  const { roomName, userName } = useParams();
  const [doStart, setDoStart] = useState(false);
  const [player, setPlayer] = useState(null);
  const [white, setWhite] = useState("");
  const [black, setBlack] = useState("");

  const [game, setGame] = useState("start");

  // Sockets
  // connecting
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {}); //later get intial game if doStart
    socket.emit("join-room", userName, roomName, ({ error }) => {
      if (error) {
        alert("Username available");
        window.location.replace(_global.CLIENT_URL + "/enter-room");
      }
    });
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);
  // update the side choosing,forfeit
  useEffect(() => {
    socket.on("chose-black", (black) => {
      if (!black) setPlayer(null);
      setBlack(black);
    });
    socket.on("chose-white", (white) => {
      if (!white) setPlayer(null);
      setWhite(white);
    });
    socket.on("forfeit", (side) => {
      if (side === "black") setBlack(null);
      if (side === "white") setWhite(null);
      if (side === player) setPlayer(null);
      setDoStart(false);
    });
    return () => {
      socket.removeListener("chose-black");
      socket.removeListener("chose-white");
    };
  }, [black, white, player]);

  // intialize and update for every move
  useEffect(() => {
    socket.once("update-game", ({ black, white }) => {
      socket.emit("system-message", `Game started`, roomName);
      if (!doStart) {
        socket.emit("send-time", "resume", "white", roomName);
        setDoStart(true);
      }
    });
  }, [doStart]);
  // end game
  useEffect(() => {
    socket.on("end-game", (result) => {
      if (result.draw) return alert("Draw");
      const winSide = result.lostSide === "b" ? "White" : "Black";
      const win_msg = `${winSide} won the game`;
      socket.emit("system-message", win_msg, roomName);
      socket.emit("send-time", "reset", null, roomName);
    });
    return () => {
      socket.removeListener("end-game");
    };
  });

  const ready = (side) => {
    socket.emit(
      "ready",
      userName,
      roomName,
      side,
      ({ error, success, black, white }) => {
        if (error) return alert(`${side} is chosen byy someone else`);
        if (success) {
          setPlayer(side);
        }
      }
    );
  };
  const renderPvPRoom = () => {
    return (
      <main class="flex content-center h-screen bg-gray-300 p-5">
        <div class=" flex ml-auto mr-auto justify-between w-full max-w-8xl">
          <MoveValidator
            roomName={roomName}
            socket={socket}
            player={player}
            doStart={doStart}
            intialFen={game}
          />
          <div class="flex flex-col justify-center">
            <Timer roomName={roomName} socket={socket} _side={`black`} />
            <button
              onClick={() => {
                ready("black");
              }}
              class="mb-3"
            >
              {black ? black : "Black"}
            </button>
            <button
              onClick={() => {
                ready("white");
              }}
              class="bg-white text-black"
            >
              {white ? white : "White"}
            </button>
            <Timer roomName={roomName} socket={socket} _side={"white"} />
            {player && (
              <button
                onClick={() => {
                  if (doStart)
                    return socket.emit("forfeit", userName, roomName, player);
                  socket.emit("cancel-side", player, roomName);
                }}
                class="bg-red-600 text-white mt-3 rounded-lg"
              >
                {doStart ? "Forfeit" : "Cancel"}
              </button>
            )}
          </div>
          <Chat roomName={roomName} socket={socket} userName={userName} />
        </div>
      </main>
    );
  };
  return <div>{renderPvPRoom()}</div>;
};

export default Room;
