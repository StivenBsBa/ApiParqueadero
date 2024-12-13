import Models from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";
const { VehicleModel, DueñoModel } = Models;

export const deleteVehicleRecord = async (req, res) => {
  try {
    const { formattedPlate } = req;

    const vehicle = await VehicleModel.findOneAndDelete(
      { plate: formattedPlate, status: "inactive" },
      { projection: { plate: 1, vehicleType: 1 } }
    );

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message:
          "El vehículo no existe, está activo o ya fue eliminado. Verifique el estado del vehículo.",
      });
    }

    res.status(200).json({
      success: true,
      message: `El vehículo con placa ${vehicle.plate} de tipo ${vehicle.vehicleType} fue eliminado exitosamente.`,
      vehicle,
    });
  } catch (error) {
    console.error("Error al eliminar el registro del vehículo:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el registro del vehículo.",
      error: error.message,
    });
  }
};
