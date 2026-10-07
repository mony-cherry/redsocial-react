import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Mi perfil', path: '/perfil' },
  { label: 'Amigos', path: '/amigos' },
  { label: 'Grupos', path: '/grupos' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Recuerdos', path: '/recuerdos' },
];

export function Sidebar() {
  return (
    <aside className="rail" aria-label="Menu principal">
      <h2 className="rail-title">Menu</h2>
      {menuItems.map((item) => (
        <NavLink
          className={({ isActive }) => `rail-item ${isActive ? 'active' : ''}`}
          key={item.path}
          to={item.path}
          end={item.path === '/'}
        >
          <span className="rail-icon">{item.label.slice(0, 1)}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
