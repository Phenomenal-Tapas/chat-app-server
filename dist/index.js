"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const users_1 = require("./utils/users");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
    socket.join("myChat");
    socket.on("handle-connection", (username) => {
        if (!(0, users_1.userJoin)(socket.id, username)) {
            socket.emit("username-taken");
        }
        else {
            socket.emit("username-created-successfully");
            io.to("myChat").emit("get-connected-users", (0, users_1.getUsers)());
        }
    });
    socket.on("message", (message) => {
        socket.broadcast.to("myChat").emit("receive-message", message);
    });
    socket.on("disconnect", () => {
        (0, users_1.userLeave)(socket.id);
    });
});
server
    .listen(port, () => console.log(`Server is listening on port ${port}`))
    .on("error", (error) => {
    console.log(JSON.stringify(error));
});
