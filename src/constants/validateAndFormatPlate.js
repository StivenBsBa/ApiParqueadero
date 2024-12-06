const validateAndFormatPlate = (plate) => {
  const platePattern = /^[A-Z0-9]{6,7}$/;

  // Verificar si la placa es undefined
  if (plate === undefined) {
    throw new Error("La placa no fue ingresada.");
  }

  // Eliminar espacios y convertir a mayúsculas
  plate = plate.toUpperCase().trim();

  // Validar si la placa es vacía
  if (!plate) {
    throw new Error("La placa no puede ser nula o vacía.");
  }

  // Validar el formato de la placa
  if (!platePattern.test(plate)) {
    throw new Error(
      "El formato de la placa no es válido. Debe ser una cadena de 6 o 7 caracteres alfanuméricos (letras y números)."
    );
  }

  return plate;
};

export default validateAndFormatPlate;
