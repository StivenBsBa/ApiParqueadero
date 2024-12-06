import express from "express";
import cors from "cors";
import connectToDatabase from "./src/config/dbConnection.js";
import router from "./src/routes/vehicleRoutes.js";
import { swaggerUi, swaggerDocs } from "./src/config/swaggerOptions.js";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
connectToDatabase();

// Rutas de la API
app.use("/api/vehicles", router);

// Configuración de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "Ruta no encontrada. Consulta la documentación de la API en /api-docs.",
  });
});

// Endpoint de estado
app.get("/status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Servidor funcionando correctamente.",
  });
});

export default app;
