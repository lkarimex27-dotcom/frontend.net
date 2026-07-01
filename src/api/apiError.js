// La API de LaTienda no es consistente en el formato de errores:
// - El AuthController a veces devuelve un string plano (ej: Unauthorized("Contraseña incorrecta"))
// - El resto de controladores devuelve { msj: "..." }
// Este helper normaliza ambos casos para mostrar un mensaje legible en la UI.
export function extractErrorMessage(error, fallback = 'Ocurrió un error inesperado.') {
  const data = error?.response?.data;

  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data?.msj === 'string') return data.msj;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.title === 'string') return data.title; // por si ASP.NET devuelve ProblemDetails

  return fallback;
}
