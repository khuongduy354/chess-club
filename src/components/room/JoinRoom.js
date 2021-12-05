// Setup
import React from "react";
import { useRef, useState } from "react";

const JoinRoom = () => {
  const roomName = useRef("");
  const userName = useRef("");
  //functions
  const renderJoinRoom = () => {
    return (
      <div>
        <button
          onClick={() => {
            window.location.replace(
              "http://localhost:3000" +
                "/room/" +
                roomName.current.value +
                "/" +
                userName.current.value
            );
          }}
        >
          Enter
        </button>
        <input type="text" ref={userName} placeholder="Enter user name" />
        <input ref={roomName} type="text" placeholder="Enter room name here" />
        <p>Nhập tên phòng, nếu phòng không tồn tại sẽ tạo phòng mới </p>
        <button>Close</button>
      </div>
    );
  };
  return (
    <div>
      <h1>Join or Create room</h1>
      {renderJoinRoom()}
    </div>
  );
};

export default JoinRoom;
