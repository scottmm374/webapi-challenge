const express = require("express");
const projectsRouter = require("./data/routers/projectsRouter.js");
// const actionsRouter = require("./data/routers/actionsRouter");

const server = express();
server.use(express.json());
server.use("/api/projects", projectsRouter);
// server.use("api/actions", actionsRouter);

server.get("/", (req, res) => {
  res.json({ message: "Welcome to API Sprint Challenge" });
});

module.exports = server;
