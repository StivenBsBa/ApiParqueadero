import VehicleModel from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";

export const updateVehicleExit = async (req, res) => {
  try {
    const { plate } = req.params;

    if (!plate) {
      return res.status(400).json({
        success: false,
        message: "La placa es obligatoria",
      });
    }

    const vehicle = await VehicleModel.findOne({ plate: plate.toUpperCase() });

    if (!vehicle) {
      return res.status(ResponseMessages.VEHICLE_NOT_FOUND.status).json({
        ...ResponseMessages.VEHICLE_NOT_FOUND,
      });
    }

    // Verificar si el vehículo ya está inactivo
    if (vehicle.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "El vehículo ya ha salido",
      });
    }

    // Calcular el tiempo de parqueo
    const entryTime = new Date(vehicle.entryTime);
    const exitTime = new Date();
    const timeDifference = exitTime - entryTime; // En milisegundos

    let hoursSpent = timeDifference / (1000 * 60 * 60); // Convertir a horas

    // Si el tiempo es menor a una hora, redondear a 1 hora
    if (hoursSpent < 1) {
      hoursSpent = 1;
    } else {
      hoursSpent = Math.ceil(hoursSpent); // Redondear hacia arriba
    }

    // Acumular el tiempo total de parqueo
    vehicle.totalTime = (vehicle.totalTime || 0) + hoursSpent; // Sumar las horas al total acumulado

    // Actualizar el vehículo con la hora de salida y el estado
    vehicle.exitTime = exitTime;
    vehicle.status = "inactive"; // Cambiar el estado a inactivo

    // Guardar los cambios en el vehículo
    await vehicle.save();

    res.status(ResponseMessages.VEHICLE_EXITED_SUCCESS.status).json({
      ...ResponseMessages.VEHICLE_EXITED_SUCCESS,
      vehicle: {
        plate: vehicle.plate,
        vehicleType: vehicle.vehicleType,
        entryTime: vehicle.entryTime,
        exitTime: vehicle.exitTime,
        status: vehicle.status,
      },
      parkingTime: `El vehículo con placa ${
        vehicle.plate
      } estuvo ${hoursSpent} ${
        hoursSpent === 1 ? "hora" : "horas"
      } en el parqueadero. El tiempo total acumulado es de ${
        vehicle.totalTime
      } ${vehicle.totalTime === 1 ? "hora" : "horas"}.`,
    });
  } catch (error) {
    res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
      error: error.message,
    });
  }
};
