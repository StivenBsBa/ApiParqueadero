import Models from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";
const { VehicleModel, DueñoModel } = Models;

const formatTotalTime = (totalTime) => {
  const totalTimeInHours = Math.floor(totalTime);
  return `${totalTimeInHours} horas`;
};

// 1. Obtener las horas de parqueo de un vehículo específico
export const getVehicleTotalPlate = async (req, res) => {
  try {
    const { formattedPlate } = req;

    // Verificar si el vehículo ya está registrado
    const vehicle = await VehicleModel.findOne({
      plate: formattedPlate,
    });

    if (!vehicle) {
      return res.status(ResponseMessages.VEHICLE_NOT_FOUND.status).json({
        ...ResponseMessages.VEHICLE_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      message: `Total de horas de parqueo del vehículo ${vehicle.plate}`,
      vehicle: {
        plate: vehicle.plate,
        vehicleType: vehicle.vehicleType,
        totalTime: vehicle.totalTime,
      },
    });
  } catch (error) {
    res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};

// 2. Obtener las horas de parqueo de todos los vehículos
export const getVehicleTotalHours = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find();

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron vehículos en el parqueadero",
      });
    }

    const vehiclesTotalTime = vehicles.map((vehicle) => ({
      plate: vehicle.plate,
      vehicleType: vehicle.vehicleType,
      totalTime: formatTotalTime(vehicle.totalTime || 0),
    }));

    res.status(200).json({
      success: true,
      message: "Horas de todos los vehículos en el parqueadero",
      vehicles: vehiclesTotalTime,
    });
  } catch (error) {
    res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};

// 3. Obtener el total de horas de todos los vehículos en el parqueadero
export const getTotalHours = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find();

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron vehículos en el parqueadero",
      });
    }

    const totalHours = vehicles.reduce(
      (acc, vehicle) => acc + (vehicle.totalTime || 0),
      0
    );
    const formattedTime = formatTotalTime(totalHours);

    res.status(200).json({
      success: true,
      message: "Total de horas de parqueo en el parqueadero",
      totalHours: formattedTime,
    });
  } catch (error) {
    res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};
