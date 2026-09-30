import { Outlet } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Contacts } from '../components/Contacts';
import { Sidebar } from '../components/Sidebar';
import { usePost } from '../hooks/usePost';

export function SocialLayout() {
  const { currentUser } = usePost();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">f</span>
          <span>RedSocial</span>
        </div>
        <input
          className="search"
          aria-label="Buscar"
          placeholder="Buscar en RedSocial"
        />
        <div className="profile-pill">
          <Avatar initials={currentUser.avatar} size="small" />
          <span>{currentUser.name}</span>
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
