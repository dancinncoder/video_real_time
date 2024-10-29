import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";

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
const SocketIoServer = SocketIO(httpServer);

// Receive connection
SocketIoServer.on("connection", (socket) => {
  // Middleware
  socket.onAny((event) => {
    console.log(`Socket Event Middleware:${event}`);
  });

  socket.on("enter_room", (roomName) => {
    console.log("room name:", roomName);
    console.log("socket ID:", socket.id);

    // Room is automatically generated, so socket.join is to Enter the room
    console.log("room info:", socket.rooms);
    socket.join(roomName);
    console.log("room info:", socket.rooms);
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
