import { apiRequest } from './api';

const SESSION_KEY = 'redsocial-react-api-session-v1';

function saveSession(user) {
  if (!user?.id || !user?.nombre || !user?.email) {
    throw new Error('La API no devolvió los datos necesarios para iniciar sesión.');
  }

  const session = {
    id: user.id,
    name: user.nombre,
    email: user.email,
    avatar: user.nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  try {
    const session = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null');
    return session?.id && session?.name && session?.email ? session : null;
  } catch {
    return null;
  }
}

export async function createAccount(name, email, password) {
  const cleanName = name.trim().replace(/\s+/g, ' ');
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || password.length < 8) {
    throw new Error('Escribe tu nombre y una contraseña de al menos 8 caracteres.');
  }

  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: { nombre: cleanName, email: cleanEmail, contrasena: password },
  });

  return saveSession(data.usuario);
}

export async function signIn(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), contrasena: password },
  });

  return saveSession(data.usuario);
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
