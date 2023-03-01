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
  console.log("dataenjsantes",data);
  var logs = data
  .map(function (elem, index) {
    return `<div>
            <strong>ID ${elem.id}</strong>:
            </div>
            <em>Title: ${elem.title}</em>
            <p>Description: ${elem.description}</p>
            <p>Price: ${elem.price}</p>
            <p>Stock: ${elem.stock}</p>
          </div>`;
  }) 
  log.innerHTML = logs;
});

socket.on("messageForEveryone", (data) => {
  console.log("🚀 ~ file: home.js:34 ~ socket.on ~ data", data);
});