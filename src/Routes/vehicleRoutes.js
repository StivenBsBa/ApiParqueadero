import express from "express";
import { vehicleEntry, reenterVehicle } from "../controllers/vehicleEntry.js";
import { deleteVehicleRecord } from "../controllers/deleteVehicleRecord.js";
import {
  listVehiclesByStatus,
  oneVehicle,
  getVehicleStats, // Asegúrate de importar la nueva función
} from "../controllers/allVehicles.js";
import { updateVehicleExit } from "../controllers/updateVehicleExit.js";
import {
  getVehicleTotalPlate,
  getVehicleTotalHours,
  getTotalHours,
} from "../controllers/totalParkingTime .js";

const router = express.Router();

// Otras rutas existentes
router.get("/list", listVehiclesByStatus);
router.get("/oneVehicles/:plate", oneVehicle);
router.get("/vehicle-hours/:plate", getVehicleTotalPlate);
router.get("/all-vehicles-hours", getVehicleTotalHours);
router.get("/total-hours", getTotalHours);
router.get("/stats", getVehicleStats);

router.post("/vehicleEntry", vehicleEntry);

router.put("/reenter/:plate", reenterVehicle);
router.put("/exit/:plate", updateVehicleExit);

router.delete("/delete/:plate", deleteVehicleRecord);

export default router;
