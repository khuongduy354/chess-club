import React, { useState, useEffect } from "react";

const Timer = ({ sec = 10, socket, _side, roomName }) => {
  const [seconds, setSeconds] = useState(sec);
  const [isActive, setIsActive] = useState(false);

  //functions
  const secondFormat = (secondsArg) => {
    secondsArg = parseInt(secondsArg);
    let minutes = parseInt(secondsArg / 60, 10);
    let seconds = parseInt(secondsArg % 60, 10);
    minutes = minutes < 10 ? "0" + minutes.toString() : minutes;
    seconds = seconds < 10 ? "0" + seconds.toString() : seconds;
    return `${minutes} : ${seconds}`;
  };

  function pause() {
    setIsActive(false);
  }
  function resume() {
    setIsActive(true);
  }
  function reset() {
    setSeconds(sec);
    setIsActive(false);
  }
  // update tick
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  // socket
  useEffect(() => {
    socket.on("receive-time", ({ option, side }) => {
      if (option === "reset") return reset();
      if (option === "resume" && side === _side) return resume();
      if (option === "pause" && side === _side) return pause();
    });
    if (seconds === 0) {
      socket.emit("timeout", _side === "black" ? "b" : "w", roomName);
    }
    return () => {
      socket.removeListener("pause-time");
      socket.removeListener("reset");
      socket.removeListener("resume");
    };
  }, [seconds]);
  return <div className="text-center">{secondFormat(seconds)}</div>;
};

export default Timer;
