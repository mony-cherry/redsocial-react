import { Avatar } from './Avatar';
import { CommentList } from './CommentList';
import { usePost } from '../hooks/usePost';
import { PostMedia } from './PostMedia';

export function FacebookPost({ post }) {
  const { togglePostLike, sharePost } = usePost();
  const commentCount = post.comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  );

  return (
    <article className="post">
      <header className="post-header">
        <div className="author">
          <Avatar initials={post.author.avatar} />
          <div>
            <strong>{post.author.name}</strong>
            <span className="post-meta">
              {post.createdAt} - {post.privacy}
            </span>
          </div>
        </div>
        <button className="menu-button" type="button" aria-label="Mas opciones">
          ...
        </button>
      </header>

      <div className="post-body">
        <p>{post.text}</p>
        {post.media && <PostMedia media={post.media} />}

        {!post.media && post.image && (
          <img
            className="post-photo"
            src={post.image}
            alt="Contenido visual de la publicación"
          />
        )}
      </div>

      <section className="post-stats" aria-label="Estadisticas del post">
        <span className="stat-left">
          <span className="like-bubble">L</span>
          <span className="stat-line">{post.likes} personas</span>
        </span>
        <span className="stat-line">
          {commentCount} comentarios - {post.shares} compartidos
        </span>
      </section>

      <section className="post-actions" aria-label="Acciones del post">
        <button
          className={`post-action ${post.liked ? 'active' : ''}`}
          type="button"
          onClick={() => togglePostLike(post.id)}
        >
          Me gusta
        </button>
        <button
          className="post-action"
          type="button"
          onClick={() => document.querySelector(`#new-comment-${post.id}`)?.focus()}
        >
          Comentar
        </button>
        <button
          className={`post-action ${post.shared ? 'active' : ''}`}
          type="button"
          onClick={() => sharePost(post.id)}
        >
          Compartir
        </button>
      </section>

      <CommentList post={post} />
    </article>
  );
}
