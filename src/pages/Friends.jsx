import { useState } from 'react';

const STORAGE_KEY = 'redsocial_friend_requests';

const friends = [
  { name: 'Laura Gomez', avatar: 'LG', mutual: 8 },
  { name: 'Andres Ruiz', avatar: 'AR', mutual: 5 },
  { name: 'Sofia Perez', avatar: 'SP', mutual: 12 },
  { name: 'Carlos Diaz', avatar: 'CD', mutual: 4 },
];

function loadFriendRequests() {
  try {
    const savedRequests = localStorage.getItem(STORAGE_KEY);

    return savedRequests ? JSON.parse(savedRequests) : {};
  } catch (error) {
    console.error('No se pudieron cargar las solicitudes:', error);
    return {};
  }
}

export function Friends() {
  const [requests, setRequests] = useState(loadFriendRequests);

  const handleFriendRequest = (friendName) => {
    setRequests((currentRequests) => {
      const updatedRequests = {
        ...currentRequests,
        [friendName]: !currentRequests[friendName],
      };

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedRequests)
        );
      } catch (error) {
        console.error(
          'No se pudo guardar la solicitud:',
          error
        );
      }

      return updatedRequests;
    });
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="page-icon">A</span>

        <div>
          <h1>Amigos</h1>

          <p>Encuentra y conecta con tus amigos.</p>
        </div>
      </div>

      <div className="page-grid">
        {friends.map((friend) => {
          const requestSent = requests[friend.name];

          return (
            <article
              className="friend-card"
              key={friend.name}
            >
              <span className="large-avatar">
                {friend.avatar}
              </span>

              <div>
                <h2>{friend.name}</h2>

                <p>
                  {friend.mutual} amigos en común
                </p>
              </div>

              <button
                type="button"
                className={
                  requestSent
                    ? 'secondary-button'
                    : 'primary-button'
                }
                onClick={() =>
                  handleFriendRequest(friend.name)
                }
              >
                {requestSent
                  ? 'Solicitud enviada ✓'
                  : 'Agregar'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
