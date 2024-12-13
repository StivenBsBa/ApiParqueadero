import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Modelo para Dueños
const DueñoSchema = new Schema({
  Cedula: { type: Number, unique: true, required: true },
  Nombre: { type: String, required: true },
});

const DueñoModel = model("Dueño", DueñoSchema);

// Modelo para Vehículos
const vehicleSchema = new Schema({
  plate: { type: String, unique: true, required: true },
  vehicleType: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date, default: null },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  totalTime: { type: Number, default: 0 },
  owner: { type: Schema.Types.ObjectId, ref: "Dueño" },
});

const VehicleModel = model("Vehicle", vehicleSchema);

export default { VehicleModel, DueñoModel };
