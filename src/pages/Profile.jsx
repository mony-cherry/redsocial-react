import { Avatar } from '../components/Avatar';
import { Composer } from '../components/Composer';
import { FacebookPost } from '../components/FacebookPost';
import { usePost } from '../hooks/usePost';

export function Profile() {
  const { currentUser, posts } = usePost();
  const userPosts = posts.filter(
    (post) =>
      post.author.id === currentUser.id ||
      (!post.author.id && post.author.name === currentUser.name),
  );

  return (
    <>
      <section className="page-card profile-card">
        <div className="profile-cover" aria-hidden="true" />
        <div className="profile-identity">
          <div className="profile-avatar">
            <Avatar initials={currentUser.avatar} />
          </div>
          <div className="profile-details">
            <h1>{currentUser.name}</h1>
            <p>{userPosts.length} publicaciones</p>
          </div>
        </div>
      </section>

      <Composer />

      <div className="profile-posts-heading">
        <h2>Publicaciones</h2>
        <span>{userPosts.length}</span>
      </div>

      {userPosts.length > 0 ? (
        userPosts.map((post) => <FacebookPost post={post} key={post.id} />)
      ) : (
        <section className="page-card profile-empty">
          <h2>Sin publicaciones todavía</h2>
          <p>Tus publicaciones aparecerán aquí.</p>
        </section>
      )}
    </>
  );
}