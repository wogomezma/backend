const socket = io();


const input = document.getElementById("textbox");
const log = document.getElementById("log");
input.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    socket.emit("messageBySocket", input.value);
    input.value = "";
  }
});

socket.on("log", (data) => {
  let logs = "";
  data.logs.forEach((log) => {
    logs += `${log.socketid} dice: ${log.message}<br/>`;
  });
  log.innerHTML = logs;
});

socket.on("messageForEveryone", (data) => {
  console.log("data", data);
});