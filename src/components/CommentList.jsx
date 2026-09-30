import { useState } from 'react';
import { Avatar } from './Avatar';
import { CommentItem } from './CommentItem';
import { usePost } from '../hooks/usePost';

export function CommentList({ post }) {
  const { currentUser, addComment } = usePost();
  const [commentText, setCommentText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const cleanText = commentText.trim();

    if (!cleanText) {
      return;
    }

    addComment(post.id, cleanText);
    setCommentText('');
  }

  return (
    <section className="comments" aria-label="Comentarios">
      <form className="comment-form" onSubmit={handleSubmit}>
        <Avatar initials={currentUser.avatar} size="small" />
        <input
          id={`new-comment-${post.id}`}
          className="comment-input"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Escribe un comentario..."
        />
      </form>

      {post.comments.map((comment) => (
        <CommentItem comment={comment} postId={post.id} key={comment.id} />
      ))}
    </section>
  );
}
