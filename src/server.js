import http from "http";
// import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
  console.log(`listening on http://localhost:3000 OR ws://localhost:3000`);

// http.createServer(requestListener)
const httpServer = http.createServer(app);
// pass server, but its optional thing to do
const SocketIoServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(SocketIoServer, {
  auth: false,
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = SocketIoServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
  // const sids = SocketIoServer.sockets.adapter.sids;
  // const rooms = SocketIoServer.sockets.adapter.rooms;
}

function countUsersInTheRoom(roomName) {
  return SocketIoServer.sockets.adapter.rooms.get(roomName)?.size;
}

// Receive connection
SocketIoServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";

  // Middleware
  socket.onAny((event) => {
    console.log(`Socket Event Middleware:${event}`);
  });

  // Nickname
  socket.on("nickname", (nickname, showRoomForm) => {
    socket["nickname"] = nickname;
    showRoomForm();
  });

  socket.on("enter_room", (roomName, showRoom) => {
    // Room is automatically generated, so socket.join is to Enter the room
    socket.join(roomName);
    showRoom();

    // Send a message to everyone in the room
    socket
      .to(roomName)
      .emit("welcomeMessage", socket.nickname, countUsersInTheRoom(roomName));

    // Send a notice message to everyone in the server
    SocketIoServer.sockets.emit("room_change", publicRooms());

    // Disconnecting
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) =>
        socket
          .to(room)
          .emit(
            "byeMessage",
            socket.nickname,
            countUsersInTheRoom(roomName) - 1
          )
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      // Send a notice message to everyone in the server
      SocketIoServer.sockets.emit("room_change", publicRooms());
    });

    // New message send
    socket.on("new_message", (message, roomName, addMessage) => {
      // To which room to send the message?
      console.log("socket name:", socket["nickname"]);
      socket
        .to(roomName)
        .emit("new_message", `${socket["nickname"]}: ${message}`);
      addMessage();
    });
  });
});

// const wss = new WebSocket.Server({ server });

// function onSocketClose() {
//   console.log("Disconnected from the Browser.");
// }

// if someone is connected to the server, I will store the data here below.
// const sockets = [];

// wss.on("event name", function)
// wss.on("connection", (frontSocket) => {
//   sockets.push(frontSocket);

//   frontSocket["nickname"] = "Anonimous";

//   console.log("Connceted to Brower.");

//   frontSocket.on("close", onSocketClose);

//   frontSocket.on("message", (message) => {
//     const parsedMessage = JSON.parse(message);
//     switch (parsedMessage.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${frontSocket.nickname}: ${parsedMessage.payload}`)
//         );
//       case "nickname":
//         frontSocket["nickname"] = parsedMessage.payload;
//     }
//   });

//   frontSocket.send("hello!");
// });

// app.listen(3000, handleListen);
httpServer.listen(3000, handleListen);
