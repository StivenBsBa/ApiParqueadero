import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGO_DB, // Nombre de la base de datos
      authSource: "admin",
      authMechanism: process.env.DB_MECHANISM,
    });
    console.log("Base de Datos Conectada");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Detener la aplicación si hay un error de conexión
  }
};

export default connectToDatabase;
