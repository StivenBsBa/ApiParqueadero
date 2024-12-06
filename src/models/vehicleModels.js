import mongoose from "mongoose";

const { Schema, model } = mongoose;

const vehicleSchema = new mongoose.Schema({
  plate: { type: String, unique: true, required: true },
  vehicleType: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date, default: null },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  totalTime: { type: Number, default: 0 }, // Tiempo total en horas
});

const VehicleModel = model("Vehicle", vehicleSchema);

export default VehicleModel;
