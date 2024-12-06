import http from "http";
import app from "./App.js";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${process.env.PORT}`);
});
