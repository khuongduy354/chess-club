import React from "react";
import { useEffect, useState, useRef } from "react";
import { _global } from "../../_global";
export const Chat = ({ socket, roomName, userName }) => {
  const [msgs, setMsgs] = useState([]);
  const msg = useRef("");
  useEffect(() => {
    socket.on("receive-message", (newMsg) => {
      setMsgs(() => {
        return [newMsg, ...msgs];
      });
    });

    return () => {
      socket.removeListener("receive-message");
    };
  }, [msgs]);
  const renderSystemMessage = (msg) => {
    return (
      <h1 class="bg-gray-300 m-0 text-center">
        <strong> {msg.from}</strong>: {msg.content}
      </h1>
    );
  };
  const otherMessage = (msg) => {
    return (
      <div class=" block text-black w-full">
        <span class="text-xs block text-gray-700 p-2">{msg.from}</span>
        <span class="bg-white rounded-xl p-2 ">{msg.content}</span>
      </div>
    );
  };
  const sendMessage = () => {
    socket.emit("send-message", msg.current.value, roomName, userName);
    msg.current.value = "";
  };
  const selfMessage = (msg) => {
    return (
      <React.Fragment>
        <div class=" block w-full text-white text-right">
          <span class="text-xs block text-gray-700 p-2">{msg.from}</span>
          <span class="bg-blue-600 rounded-xl p-2 ">{msg.content}</span>
        </div>
      </React.Fragment>
    );
  };
  return (
    <div class=" flex flex-col bg-black bg-opacity-5 p-3  justify-end  w-5/12 ">
      <div class="max-h-full">
        <div
          class="overflow-y-scroll flex flex-col-reverse pr-3 "
          style={{ maxHeight: "80%" }}
        >
          {msgs.map((_msg, index) => (
            <h1 key={index} class="pr-2 pb-2">
              {_msg.from === userName
                ? selfMessage(_msg)
                : _msg.from == "System"
                ? renderSystemMessage(_msg)
                : otherMessage(_msg)}
            </h1>
          ))}
        </div>
        <div class="flex flex-col  items-end ">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            class=" block p-2 mt-2 mb-3 w-full "
            ref={msg}
            type="text"
            placeholder={`${userName}: `}
          />
          <div class="flex justify-between w-full">
            <button
              class="bg-red-700 text-white"
              onClick={() => {
                window.location.replace(_global.CLIENT_URL + "/enter-room");
              }}
            >
              Leave
            </button>
            <button class="w-40 bg-indigo-900 " onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
