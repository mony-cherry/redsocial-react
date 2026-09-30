import { useState } from 'react';

const memories = [
  {
    date: 'Hace 1 año',
    text: 'Terminamos nuestro primer proyecto de React y celebramos el avance del equipo.',
  },
  {
    date: 'Hace 2 años',
    text: 'Un día para recordar: aprendiendo nuevas tecnologías y compartiendo conocimiento.',
  },
];

export function Memories() {
  const [sharedMemory, setSharedMemory] = useState(null);

  const handleShare = async (memory) => {
    const shareText = `${memory.date}: ${memory.text}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Recuerdo de RedSocial',
          text: shareText,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }

      setSharedMemory(memory.date);
      setTimeout(() => setSharedMemory(null), 2500);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setSharedMemory(memory.date);
        setTimeout(() => setSharedMemory(null), 2500);
      }
    }
  };

  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="page-icon">R</span>
        <div>
          <h1>Recuerdos</h1>
          <p>Vuelve a momentos importantes de tu historia.</p>
        </div>
      </div>

      <div className="page-list">
        {memories.map((memory) => (
          <article className="memory-card" key={memory.date}>
            <span className="memory-date">{memory.date}</span>
            <p>{memory.text}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => handleShare(memory)}
            >
              {sharedMemory === memory.date
                ? '¡Recuerdo compartido! ✓'
                : 'Compartir recuerdo'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
