const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
).replace(/\/+$/, '');

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con la API. Comprueba que el backend esté iniciado.',
      );
    }

    throw error;
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('La API devolvió una respuesta no válida.');
  }

  if (!response.ok) {
    throw new Error(data.msg || data.error || 'No se pudo completar la solicitud.');
  }

  return data;
}
