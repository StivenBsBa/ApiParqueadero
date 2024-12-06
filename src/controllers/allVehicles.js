import VehicleModel from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import validateAndFormatPlate from "./validateAndFormatPlate.js";

export const oneVehicle = async (req, res) => {
  try {
    let { plate } = req.params;

    // Validar y formatear la placa
    let formattedPlate;
    try {
      formattedPlate = validateAndFormatPlate(plate);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Buscar un vehículo por placa
    const vehicle = await VehicleModel.findOne({ plate: formattedPlate });

    if (!vehicle) {
      return res.status(ResponseMessages.VEHICLE_NOT_FOUND.status).json({
        ...ResponseMessages.VEHICLE_NOT_FOUND,
      });
    }

    // Responder con el vehículo encontrado
    return res.status(ResponseMessages.VEHICLE_LIST_SUCCESS.status).json({
      ...ResponseMessages.VEHICLE_LIST_SUCCESS,
      vehicle,
    });
  } catch (error) {
    return res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
    });
  }
};

export const listVehiclesByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (status && !["active", "inactive"].includes(status)) {
      return sendResponse(res, ResponseMessages.INVALID_STATUS_VALUE);
    }

    const query = status ? { status } : {};

    const vehicles = await VehicleModel.find(query);

    if (vehicles.length === 0) {
      return res.status(ResponseMessages.SERVER_ERROR.status).json({
        success: false,
        message: `No se encontraron vehículos con estado ${
          status || "cualquiera"
        }`,
      });
    }

    // Responder con los vehículos encontrados
    res.status(ResponseMessages.VEHICLE_LIST_SUCCESS.status).json({
      ...ResponseMessages.VEHICLE_LIST_SUCCESS,
      vehicles,
    });
  } catch (error) {
    res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
    });
  }
};
