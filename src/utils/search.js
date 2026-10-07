import { apiRequest } from './api';

export function searchSocial(query, signal) {
  return apiRequest(`/busqueda?q=${encodeURIComponent(query)}`, { signal }).then(
    (results) => {
      if (
        !results
        || !Array.isArray(results.usuarios)
        || !Array.isArray(results.publicaciones)
        || !Array.isArray(results.grupos)
      ) {
        throw new Error('La API devolvió resultados de búsqueda no válidos.');
      }

      return results;
    },
  );
}
