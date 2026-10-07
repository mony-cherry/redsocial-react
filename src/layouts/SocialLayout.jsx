import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Contacts } from '../components/Contacts';
import { Sidebar } from '../components/Sidebar';
import { usePost } from '../hooks/usePost';
import { searchSocial } from '../utils/search';

export function SocialLayout() {
  const { currentUser, logout } = usePost();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchState, setSearchState] = useState(null);
  const query = searchTerm.trim();

  useEffect(() => {
    if (query.length < 2) {
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const data = await searchSocial(query, controller.signal);
        setSearchState({ query, data });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSearchState({ query, error: error.message });
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const currentSearch = searchState?.query === query ? searchState : null;
  const searchResults = currentSearch?.data;
  const hasResults = searchResults
    && searchResults.usuarios.length + searchResults.publicaciones.length
      + searchResults.grupos.length > 0;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">f</span>
          <span>RedSocial</span>
        </div>
        <div className="search-container">
          <input
            className="search"
            type="search"
            aria-label="Buscar personas, publicaciones y grupos"
            aria-controls="search-results"
            placeholder="Buscar en RedSocial"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setSearchTerm('');
              }
            }}
          />
          {query.length >= 2 && (
            <section
              className="search-results"
              id="search-results"
              aria-label="Resultados de búsqueda"
              aria-live="polite"
            >
              {currentSearch?.error ? (
                <p className="search-message" role="alert">
                  {currentSearch.error}
                </p>
              ) : !searchResults ? (
                <p className="search-message">Buscando...</p>
              ) : !hasResults ? (
                <p className="search-message">No se encontraron resultados.</p>
              ) : (
                <>
                  {searchResults.usuarios.length > 0 && (
                    <div className="search-category">
                      <h2>Personas</h2>
                      {searchResults.usuarios.map((user) => (
                        <div className="search-result" key={`user-${user.id}`}>
                          <Avatar
                            initials={user.nombre
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join('')
                              .toUpperCase()}
                            size="small"
                          />
                          <span>{user.nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.publicaciones.length > 0 && (
                    <div className="search-category">
                      <h2>Publicaciones</h2>
                      {searchResults.publicaciones.map((post) => (
                        <div className="search-result" key={`post-${post.id}`}>
                          <span className="search-result-text">
                            {post.autor}: {post.texto}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.grupos.length > 0 && (
                    <div className="search-category">
                      <h2>Grupos</h2>
                      {searchResults.grupos.map((group) => (
                        <div className="search-result" key={`group-${group.id}`}>
                          <span>{group.nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
        <div className="topbar-account">
          <Link
            className="profile-pill"
            to="/perfil"
            aria-label={`Ver perfil de ${currentUser.name}`}
          >
            <Avatar initials={currentUser.avatar} size="small" />
            <span>{currentUser.name}</span>
          </Link>
          <button className="logout-button" type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="layout">
        <Sidebar />
        <section className="feed" aria-label="Contenido principal">
          <Outlet />
        </section>
        <Contacts />
      </section>
    </main>
  );
}
