import { io } from "socket.io-client";
import { _global } from "../../_global";
const serverUrl = _global.SERVER_URL;
const socket = io(serverUrl, { autoConnect: false });

export default socket;
