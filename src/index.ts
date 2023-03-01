import express from "express";
import http from "http";
import { Server } from "socket.io";
import { userJoin, userLeave, getUsers } from "./utils/users";

const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.join("myChat");

  socket.on("handle-connection", (username: string) => {
    if (!userJoin(socket.id, username)) {
      socket.emit("username-taken");
    } else {
      socket.emit("username-created-successfully");
      io.to("myChat").emit("get-connected-users", getUsers());
    }
  });

  socket.on("message", (message: { message: string; username: string }) => {
    socket.broadcast.to("myChat").emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    userLeave(socket.id);
  });
});

server
  .listen(port, () => console.log(`Server is listening on port ${port}`))
  .on("error", (error) => {
    console.log(JSON.stringify(error));
  });
