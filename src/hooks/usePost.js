import { useContext } from 'react';
import { PostContext } from '../context/postContextObject';

export function usePost() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error('usePost debe usarse dentro de PostProvider');
  }

  return context;
}
