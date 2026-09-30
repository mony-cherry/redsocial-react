import { Composer } from '../components/Composer';
import { FacebookPost } from '../components/FacebookPost';
import { usePost } from '../hooks/usePost';

export function Home() {
  const { posts } = usePost();

  return (
    <>
      <Composer />
      {posts.map((post) => (
        <FacebookPost post={post} key={post.id} />
      ))}
    </>
  );
}
