const createResponseMessage = (status, success, message) => ({
  status,
  success,
  message,
});

export const ResponseMessages = {
  // Mensajes de éxito
  VEHICLE_REGISTERED_SUCCESS: createResponseMessage(
    201,
    true,
    "Vehículo registrado con éxito."
  ),

  VEHICLE_DELETED_SUCCESS: createResponseMessage(
    200,
    true,
    "Vehículo eliminado con éxito."
  ),
  VEHICLE_EXITED_SUCCESS: createResponseMessage(
    200,
    true,
    "Vehículo ha salido correctamente."
  ),
  VEHICLE_LIST_SUCCESS: createResponseMessage(
    200,
    true,
    "Vehículos listados correctamente."
  ),

  VEHICLE_NOT_FOUND: createResponseMessage(
    404,
    false,
    "Vehículo no encontrado."
  ),

  VEHICLE_ACTIVE: createResponseMessage(400, false, "El vehículo está activo."),
  VEHICLE_INACTIVE: createResponseMessage(
    400,
    false,
    "El vehículo está inactivo."
  ),

  SERVER_ERROR: createResponseMessage(
    500,
    false,
    "Error al procesar la solicitud. Intente nuevamente."
  ),
  INVALID_DATE_FORMAT: createResponseMessage(
    400,
    false,
    "El formato de la fecha no es válido."
  ),
};
