export const initialPost = {
  id: crypto.randomUUID(),
  author: {
    name: 'Campus React',
    avatar: 'CR',
  },
  createdAt: 'Hace 12 min',
  privacy: 'Publico',
  text: 'Terminamos la plantilla RedSocial y ahora la convertimos en componentes de React. El post ya permite likes, comentarios, respuestas y compartir.',
  image:
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  likes: 24,
  liked: false,
  shares: 0,
  shared: false,
  comments: [
    {
      id: crypto.randomUUID(),
      author: 'Laura Gomez',
      avatar: 'LG',
      text: 'Quedo muy parecido a un post real de Facebook.',
      liked: false,
      likes: 2,
      replies: [
        {
          id: crypto.randomUUID(),
          author: 'Campus React',
          avatar: 'CR',
          text: 'La clave fue separar cada parte en componentes.',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      author: 'Andres Ruiz',
      avatar: 'AR',
      text: 'Ahora si se entiende para que sirve useState.',
      liked: true,
      likes: 4,
      replies: [],
    },
  ],
};
