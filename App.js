import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectToDatabase from "./src/config/dbConnection.js";
import router from "./src/Routes/vehicleRoutes.js";

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos
connectToDatabase();

// Rutas
app.use("/api/vehicles", router);
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message:
      "Ruta no encontrada. Verifica la URL o consulta la documentación de la API.",
  });
});

app.get("/status", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Servidor Corriendo",
  });
});

export default app;
