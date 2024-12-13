import Models from "../models/vehicleModels.js";
import { ResponseMessages } from "../constants/responseMessages.js";

const { VehicleModel, DueñoModel } = Models;

// Función para obtener un solo vehículo por placa
export const oneVehicle = async (req, res) => {
  try {
    const { formattedPlate } = req;

    // Verificar si el vehículo ya está registrado
    const vehicle = await VehicleModel.findOne(
      {
        plate: formattedPlate,
      },
      {
        _id: 0,
        owner: 0,
        __v: 0,
      }
    );

    if (!vehicle) {
      return res.status(ResponseMessages.VEHICLE_NOT_FOUND.status).json({
        ...ResponseMessages.VEHICLE_NOT_FOUND,
      });
    }

    // Responder con el vehículo encontrado
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    return res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
    });
  }
};

// Función para listar vehículos por estado (activo/inactivo)
export const listVehiclesByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (status && !["active", "inactive"].includes(status)) {
      return sendResponse(res, ResponseMessages.INVALID_STATUS_VALUE);
    }

    const query = status ? { status } : {};

    const vehicles = await VehicleModel.find(query, {
      _id: 0,
      owner: 0,
      __v: 0,
    });

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

// Función para listar Usuario por cédula
export const oneCedula = async (req, res) => {
  try {
    const { Cedula } = req.params;

    // Buscar al dueño por cédula
    const Dueño = await DueñoModel.findOne({ Cedula });
    if (!Dueño) {
      return res
        .status(404)
        .json({ success: false, message: "Dueño no encontrado" });
    }

    // Buscar los vehículos asociados a ese dueño
    const vehicles = await VehicleModel.find(
      { owner: Dueño._id },
      { _id: 0, owner: 0, __v: 0 }
    );

    return res.status(200).json({
      success: true,
      message: `El dueño ${Dueño.Nombre} con cédula ${Cedula} tiene los siguientes vehículos:`,
      vehicles,
    });
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error.message,
    });
  }
};

// Función para obtener las estadísticas de los vehículos
export const getVehicleStats = async (req, res) => {
  try {
    // Total de vehículos
    const totalVehicles = await VehicleModel.countDocuments();

    // Total de vehículos activos
    const totalActiveVehicles = await VehicleModel.countDocuments({
      status: "active",
    });

    // Total de vehículos inactivos
    const totalInactiveVehicles = await VehicleModel.countDocuments({
      status: "inactive",
    });

    // Total de motos activas
    const totalActiveMotos = await VehicleModel.countDocuments({
      vehicleType: "Moto",
      status: "active",
    });

    // Total de motos inactivas
    const totalInactiveMotos = await VehicleModel.countDocuments({
      vehicleType: "Moto",
      status: "inactive",
    });

    // Total de carros activos
    const totalActiveCarros = await VehicleModel.countDocuments({
      vehicleType: "Carro",
      status: "active",
    });

    // Total de carros inactivos
    const totalInactiveCarros = await VehicleModel.countDocuments({
      vehicleType: "Carro",
      status: "inactive",
    });

    return res.status(200).json({
      success: true,
      message: "Estadísticas de vehículos obtenidas correctamente.",
      data: {
        "total de Vehículos": totalVehicles,
        "total de Vehículos activos": totalActiveVehicles,
        "total de Vehículos Inactivos": totalInactiveVehicles,
        "total de Motos Activas": totalActiveMotos,
        "total de Motos Inactivas": totalInactiveMotos,
        "total de Carros Activos": totalActiveCarros,
        "total de Carros Inactivos": totalInactiveCarros,
      },
    });
  } catch (error) {
    return res.status(ResponseMessages.SERVER_ERROR.status).json({
      ...ResponseMessages.SERVER_ERROR,
    });
  }
};
