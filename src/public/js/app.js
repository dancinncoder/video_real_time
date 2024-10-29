// io is a function that connects backend to socketio automatically
const backSocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(message) {
  console.log(`the backend says ${message}`);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // backSocekt.emit("event name", argument in object form, and string form, callback function). We can send any kind of event.
  backSocket.emit(
    "enter_room",
    input.value
    // For the security risk, backend should not excecute the code from the front-end.
  );
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
