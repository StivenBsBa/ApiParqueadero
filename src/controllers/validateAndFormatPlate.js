// validateAndFormatPlate.js
const validateAndFormatPlate = (plate) => {
  const platePattern = /^[A-Z0-9]{6,7}$/;

  // Validar si la placa está vacía
  if (!plate?.trim()) {
    throw new Error("La placa no puede estar vacía.");
  }

  // Formatear la placa y validarla
  const formattedPlate = plate.toUpperCase().trim();
  if (!platePattern.test(formattedPlate)) {
    throw new Error("El formato de la placa no es válido.");
  }

  return formattedPlate;
};

export default validateAndFormatPlate;
