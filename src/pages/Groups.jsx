import { useEffect, useState } from 'react';

const GROUPS_STORAGE_KEY = 'redsocial-react-groups-v1';

const groups = [
  { name: 'Desarrollo React', members: '1.2 mil miembros', icon: 'R' },
  { name: 'Programadores Medellín', members: '856 miembros', icon: 'P' },
  { name: 'Diseño y tecnología', members: '642 miembros', icon: 'D' },
];

function loadJoinedGroups() {
  const savedGroups = window.localStorage.getItem(GROUPS_STORAGE_KEY);

  if (!savedGroups) {
    return {};
  }

  try {
    const parsedGroups = JSON.parse(savedGroups);
    return parsedGroups && typeof parsedGroups === 'object'
      ? parsedGroups
      : {};
  } catch {
    return {};
  }
}

export function Groups() {
  const [joinedGroups, setJoinedGroups] = useState(loadJoinedGroups);

  useEffect(() => {
    window.localStorage.setItem(
      GROUPS_STORAGE_KEY,
      JSON.stringify(joinedGroups),
    );
  }, [joinedGroups]);

  const handleGroup = (groupName) => {
    setJoinedGroups((currentGroups) => ({
      ...currentGroups,
      [groupName]: !currentGroups[groupName],
    }));
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="page-icon">G</span>
        <div>
          <h1>Grupos</h1>
          <p>Comunidades para compartir intereses y conocimientos.</p>
        </div>
      </div>

      <div className="page-list">
        {groups.map((group) => {
          const isMember = Boolean(joinedGroups[group.name]);

          return (
            <article className="list-card" key={group.name}>
              <span className="large-avatar">{group.icon}</span>
              <div>
                <h2>{group.name}</h2>
                <p>{group.members}</p>
              </div>
              <button
                type="button"
                className={isMember ? 'secondary-button' : 'primary-button'}
                onClick={() => handleGroup(group.name)}
              >
                {isMember ? 'Miembro ✓' : 'Unirme'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
