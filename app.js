const express = require("express");
const socket = require("socket.io");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static("public"));

const server = app.listen(port)

const io = socket(server);

io.on("connection", (socket) => {
    console.log("New connection");

    socket.on("beginPath", (coords) => {
        io.sockets.emit("beginPath", coords);
    });

    socket.on("drawline", (data) => {
        io.sockets.emit("drawline", data);
    })

    socket.on("undo", (data) => {
        io.sockets.emit("undo", data)
    })

    socket.on("redo", (data) => {
        io.sockets.emit("redo", data)
    })

    socket.on("resetCursor", () => {
        io.sockets.emit("resetCursor")
    })
})
