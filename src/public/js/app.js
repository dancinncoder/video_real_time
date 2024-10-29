// io is a function that connects backend to socketio automatically
const backSocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  backSocket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  //Send a message
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
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

form.addEventListener("submit", handleRoomSubmit);

backSocket.on("welcomeMessage", () => {
  addMessage("someone joined!");
});

backSocket.on("byeMessage", () => {
  addMessage("someone left.");
});

//Receive new message
backSocket.on("new_message", addMessage);
