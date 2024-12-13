import Models from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";

const CAR_LIMIT = 10; // Límite de carros
const MOTORCYCLE_LIMIT = 20; // Límite de motos
const { VehicleModel, DueñoModel } = Models;

export const vehicleEntry = async (req, res) => {
  try {
    const { vehicleType, entryTime, exitTime, status, Cedula, Nombre } =
      req.body;
    const { formattedPlate } = req;

    // Verificar si el vehículo ya está registrado
    const existingVehicle = await VehicleModel.findOne({
      plate: formattedPlate,
    });
    if (existingVehicle) {
      return res
        .status(ResponseMessages.VEHICLE_ALREADY_REGISTERED.status)
        .json(ResponseMessages.VEHICLE_ALREADY_REGISTERED);
    }

    // Validar fechas si son proporcionadas
    const validateDate = (date) => isNaN(new Date(date).getTime());
    if (entryTime && validateDate(entryTime)) {
      return res
        .status(ResponseMessages.INVALID_DATE_FORMAT.status)
        .json(ResponseMessages.INVALID_DATE_FORMAT);
    }
    if (exitTime && validateDate(exitTime)) {
      return res
        .status(ResponseMessages.INVALID_DATE_FORMAT.status)
        .json(ResponseMessages.INVALID_DATE_FORMAT);
    }

    // Verificar disponibilidad según el tipo de vehículo
    const limits = { Carro: CAR_LIMIT, Moto: MOTORCYCLE_LIMIT };
    const activeVehicles = await VehicleModel.countDocuments({
      vehicleType,
      status: "active",
    });

    if (!limits[vehicleType]) {
      return res.status(400).json({
        success: false,
        message: "Tipo de vehículo inválido debe ser Carro o Moto.",
      });
    }

    if (activeVehicles >= limits[vehicleType]) {
      return res.status(400).json({
        success: false,
        message: `No hay espacio para más ${
          vehicleType === "Carro" ? "carros" : "motos"
        }.`,
      });
    }

    // Crear el Dueño si no existe
    let owner = await DueñoModel.findOne({ Cedula });
    if (!owner) {
      owner = await DueñoModel.create({ Cedula, Nombre });
    }

    // Registrar el nuevo vehículo
    const newVehicle = await VehicleModel.create({
      plate: formattedPlate,
      vehicleType,
      entryTime,
      exitTime,
      status,
      Cedula,
      Nombre,
      owner: owner._id,
    });

    return res.status(ResponseMessages.VEHICLE_REGISTERED_SUCCESS.status).json({
      ...ResponseMessages.VEHICLE_REGISTERED_SUCCESS,
      vehicle: newVehicle,
    });
  } catch (error) {
    console.error("Error al registrar vehículo:", error);
    return res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};

export const reenterVehicle = async (req, res) => {
  try {
    const { formattedPlate } = req;

    // Buscar el vehículo
    const vehicle = await VehicleModel.findOne({ plate: formattedPlate });
    if (!vehicle) {
      return res
        .status(ResponseMessages.VEHICLE_NOT_FOUND.status)
        .json(ResponseMessages.VEHICLE_NOT_FOUND);
    }

    // Verificar si el vehículo ya está activo
    if (vehicle.status === "active") {
      return res.status(400).json({
        success: false,
        message: `El vehículo con placa ${vehicle.plate} de tipo ${vehicle.vehicleType} se encuentra en el parqueadero.`,
      });
    }

    // Verificar espacio disponible
    const limits = { Carro: CAR_LIMIT, Moto: MOTORCYCLE_LIMIT };
    const activeVehicles = await VehicleModel.countDocuments({
      vehicleType: vehicle.vehicleType,
      status: "active",
    });

    if (activeVehicles >= (limits[vehicle.vehicleType] || 0)) {
      return res.status(400).json({
        success: false,
        message: `No hay espacio para más ${
          vehicle.vehicleType === "Carro" ? "carros" : "motos"
        }.`,
      });
    }

    // Actualizar el estado del vehículo
    vehicle.status = "active";
    vehicle.entryTime = new Date(); // Actualizar la hora de entrada
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: ResponseMessages.VEHICLE_REGISTERED_SUCCESS.message,
      vehicle: {
        plate: vehicle.plate,
        vehicleType: vehicle.vehicleType,
        entryTime: vehicle.entryTime,
        status: vehicle.status,
      },
    });
  } catch (error) {
    console.error("Error al procesar la reentrada del vehículo:", error);
    return res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};
