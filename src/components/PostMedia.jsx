import { useEffect, useState } from 'react';
import { getMedia } from '../utils/mediaStorage';

export function PostMedia({ media }) {
  const [mediaUrl, setMediaUrl] = useState('');

  useEffect(() => {
    let objectUrl = '';
    let isMounted = true;

    async function loadMedia() {
      try {
        const storedMedia = await getMedia(media.id);

        if (!storedMedia || !isMounted) {
          return;
        }

        objectUrl = URL.createObjectURL(storedMedia.blob);
        setMediaUrl(objectUrl);
      } catch (error) {
        console.error('No fue posible cargar el archivo multimedia.', error);
      }
    }

    loadMedia();

    return () => {
      isMounted = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [media.id]);

  if (!mediaUrl) {
    return <div className="post-media-loading">Cargando archivo...</div>;
  }

  if (media.type.startsWith('video/')) {
    return (
      <video
        className="post-video"
        src={mediaUrl}
        controls
        playsInline
      />
    );
  }

  return (
    <img
      className="post-photo"
      src={mediaUrl}
      alt="Archivo publicado por el usuario"
    />
  );
}
