import { useState } from 'react';
import { Avatar } from './Avatar';
import { usePost } from '../hooks/usePost';

export function CommentItem({ comment, postId, isReply = false }) {
  const { currentUser, addReply, toggleCommentLike } = usePost();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  function handleReplySubmit(event) {
    event.preventDefault();

    const cleanText = replyText.trim();

    if (!cleanText) {
      return;
    }

    addReply(postId, comment.id, cleanText);
    setReplyText('');
    setShowReplyForm(false);
  }

  return (
    <div className="comment">
      <Avatar initials={comment.avatar} size="tiny" />
      <div className="comment-content">
        <div className="comment-bubble">
          <span className="comment-author">{comment.author}</span>
          <p>{comment.text}</p>
        </div>

        {!isReply && (
          <div className="comment-tools">
            <button
              className={`comment-action ${comment.liked ? 'active' : ''}`}
              type="button"
              onClick={() => toggleCommentLike(postId, comment.id)}
            >
              Me gusta
            </button>
            <button
              className="comment-action"
              type="button"
              onClick={() => setShowReplyForm((visible) => !visible)}
            >
              Responder
            </button>
            <span className="comment-time">{comment.likes} likes</span>
          </div>
        )}

        {showReplyForm && (
          <form className="reply-form" onSubmit={handleReplySubmit}>
            <Avatar initials={currentUser.avatar} size="tiny" />
            <input
              className="reply-input"
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Escribe una respuesta..."
              autoFocus
            />
            <button className="reply-submit" type="submit">
              Enviar
            </button>
          </form>
        )}

        {!isReply && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <CommentItem
                comment={reply}
                postId={postId}
                isReply
                key={reply.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
