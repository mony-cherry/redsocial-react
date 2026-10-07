import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../hooks/usePost';

export function AuthPage() {
  const { login, register } = usePost();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistering = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (isRegistering && password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'No se pudo completar el acceso.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode() {
    setMode(isRegistering ? 'login' : 'register');
    setError('');
    setPassword('');
    setConfirmation('');
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand">
          <span className="brand-mark">f</span>
          <span>RedSocial</span>
        </div>
        <h1 id="auth-title">
          {isRegistering ? 'Crea tu cuenta' : 'Iniciar sesión'}
        </h1>
        <p className="auth-description">
          {isRegistering ? 'Únete a la conversación.' : 'Continúa en tu comunidad.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label className="auth-field">
              Nombre completo
              <input
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                required
              />
            </label>
          )}
          <label className="auth-field">
            Correo electrónico
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            Contraseña
            <input
              type="password"
              autoComplete={
                isRegistering ? 'new-password' : 'current-password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={isRegistering ? 8 : undefined}
              required
            />
          </label>
          {isRegistering && (
            <label className="auth-field">
              Confirmar contraseña
              <input
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                minLength={8}
                required
              />
            </label>
          )}

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Un momento...'
              : isRegistering
                ? 'Crear cuenta'
                : 'Iniciar sesión'}
          </button>
        </form>

        {!isRegistering && (
          <p className="auth-reset-note">
            ¿Olvidaste tu contraseña? La recuperación por correo estará disponible
            cuando se configure el servicio de email.
          </p>
        )}
        <p className="auth-switch">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button type="button" onClick={switchMode}>
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
        <p className="auth-local-note">
          Las credenciales se validan en el backend. La sesión se conserva en este
          navegador.
        </p>
      </section>
    </main>
  );
}