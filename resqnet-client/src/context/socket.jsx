// import io from "socket.io-client";

// const socket = io("http://localhost:3000");

// export default socket;


import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"], // optional, improves compatibility
});

export default socket;
