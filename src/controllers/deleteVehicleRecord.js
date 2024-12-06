import VehicleModel from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import validateAndFormatPlate from "./validateAndFormatPlate.js";

export const deleteVehicleRecord = async (req, res) => {
  try {
    const { plate } = req.params;
    // Validación de placa
    let formattedPlate;
    try {
      formattedPlate = validateAndFormatPlate(plate);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const vehicle = await VehicleModel.findOne({ plate: formattedPlate });

    // Si el vehículo no existe
    if (!vehicle) {
      return res
        .status(ResponseMessages.VEHICLE_NOT_FOUND.status)
        .json(ResponseMessages.VEHICLE_NOT_FOUND);
    }

    // Verificar si el vehículo está activo
    if (vehicle.status === "active") {
      return res
        .status(ResponseMessages.VEHICLE_ACTIVE.status)
        .json(ResponseMessages.VEHICLE_ACTIVE);
    }

    // Si el vehículo está inactivo, proceder con la eliminación
    await VehicleModel.findOneAndDelete({ plate: plate.toUpperCase() });

    res.status(ResponseMessages.VEHICLE_DELETED_SUCCESS.status).json({
      ...ResponseMessages.VEHICLE_DELETED_SUCCESS,
    });
  } catch (error) {
    res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};
