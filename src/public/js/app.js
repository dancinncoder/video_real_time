const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

function makeMessage(type, payload) {
  const message = { type, payload };
  return JSON.stringify(message);
}

const backSocket = new WebSocket(`ws://${window.location.host}`);

//receive message(=event)

function handleEventOpen() {
  console.log("Connceted to Server.");
}

function handleEventMessage(message) {
  console.log("New message : ", message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
}

function handleEventClose() {
  console.log("Disconnected from the server.");
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  backSocket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  backSocket.send(makeMessage("nickname", input.value));
  input.value = "";
}

backSocket.addEventListener("open", handleEventOpen);

backSocket.addEventListener("message", handleEventMessage);

backSocket.addEventListener("close", handleEventClose);

// setTimeout(() => {
//   backSocket.send("hello from the browser");
// }, 5000);

messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNicknameSubmit);
