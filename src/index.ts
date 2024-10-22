import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { getUserId } from "./utils";

const app = express();
const port = process.env.PORT || 3000;

const httpServer = app.listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
});

const wss = new WebSocketServer({ noServer: true });

const onSocketPreError = (e: Error) => {
  console.error(e);
};

const onSocketPostError = (e: Error) => {
  console.error(e);
};

httpServer.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  // perform auth
  const userId = getUserId(req.headers.authorization);
  if (!userId) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req, userId);
  });
});

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

wss.on(
  "connection",
  (ws: CustomWebSocket, req: IncomingMessage, userId: string) => {
    console.log(`New connection from userId: ${userId}`);

    ws.on("error", onSocketPostError);

    ws.on("message", (msg, isBinary) => {
      ws.send(`hello user id ${userId}`, { binary: false });
    });

    ws.on("close", () => {
      console.log("Websocket closed");
    });
  }
);
