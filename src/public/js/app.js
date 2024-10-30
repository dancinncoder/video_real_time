// io is a function that connects backend to socketio automatically
const backSocket = io();

const welcome = document.getElementById("welcome");
const setup = document.getElementById("setup");
const form = welcome.querySelector("form");
const nicknameForm = setup.querySelector("#name");
const room = document.getElementById("room");
const openRooms = welcome.querySelector("#openedRooms");

room.hidden = true;
welcome.hidden = true;

let roomName;

function handleAutoFillRoomName(room) {
  console.log("room:", room);
}

function showRoomForm() {
  nicknameForm.hidden = true;
  welcome.hidden = false;
  room.hidden = true;
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  const value = input.value;
  backSocket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = setup.querySelector("#name input");
  const value = input.value;
  backSocket.emit("nickname", value, showRoomForm);
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  nicknameForm.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  //Send a message
  const messageForm = room.querySelector("#message");
  // const nameForm = room.querySelector("#name");
  messageForm.addEventListener("submit", handleMessageSubmit);
  // nameForm.addEventListener("submit", handleNicknameSubmit);
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // backSocekt.emit("event name", argument in object form, and string form, callback function). We can send any kind of event.
  backSocket.emit(
    "enter_room",
    input.value,
    showRoom
    // For the security risk, backend should not excecute the code from the front-end.
  );
  roomName = input.value;
  input.value = "";
}

nicknameForm.addEventListener("submit", handleNicknameSubmit);
form.addEventListener("submit", handleRoomSubmit);
openRooms.addEventListener("submit", handleAutoFillRoomName(room));

backSocket.on("welcomeMessage", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined!`);
});

backSocket.on("byeMessage", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} left.`);
});

//Receive new message
backSocket.on("new_message", addMessage);

//Send notice message to all
backSocket.on("room_change", (rooms) => {
  // if there is no any room
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const button = document.createElement("button");
    button.innerText = room;
    roomList.append(button);
  });
});
