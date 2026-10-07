import { useEffect, useState } from 'react';
import { initialPost } from '../data/initialPost';
import { PostContext } from './postContextObject';
import { saveMedia } from '../utils/mediaStorage';
import {
  clearSession,
  createAccount,
  getSession,
  signIn,
} from '../utils/authStorage';

const STORAGE_KEY = 'redsocial-react-post-v2';

function loadPosts() {
  const savedPost = window.localStorage.getItem(STORAGE_KEY);

  if (!savedPost) {
    return [initialPost];
  }

  try {
    const parsedPost = JSON.parse(savedPost);
    const posts = Array.isArray(parsedPost) ? parsedPost : [parsedPost];

    return posts.map((post) => {
      const isUnsharedInitialPost =
        post.author?.name === initialPost.author.name &&
        post.text === initialPost.text &&
        post.shared !== true &&
        post.shares === 3;

      return isUnsharedInitialPost ? { ...post, shares: 0 } : post;
    });
  } catch {
    return [initialPost];
  }
}

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(loadPosts);

  const [currentUser, setCurrentUser] = useState(getSession);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  async function register(name, email, password) {
    const user = await createAccount(name, email, password);
    setCurrentUser(user);
  }

  async function login(email, password) {
    const user = await signIn(email, password);
    setCurrentUser(user);
  }

  function logout() {
    clearSession();
    setCurrentUser(null);
  }

  function togglePostLike(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }),
    );
  }

  function sharePost(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          shared: !post.shared,
          shares: post.shared
            ? Math.max(0, post.shares - 1)
            : post.shares + 1,
        };
      }),
    );
  }

  async function addPost(text, mediaFile = null) {
    const cleanText = text.trim();

    if (!cleanText && !mediaFile) {
      return;
    }

    const newPostId = crypto.randomUUID();

    if (mediaFile) {
      await saveMedia(newPostId, mediaFile);
    }

    const newPost = {
      id: newPostId,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      createdAt: 'Ahora',
      privacy: 'Publico',
      text: cleanText,
      image: null,
      media: mediaFile
        ? {
            id: newPostId,
            type: mediaFile.type,
            name: mediaFile.name,
          }
        : null,
      likes: 0,
      liked: false,
      shares: 0,
      shared: false,
      comments: [],
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
  }

  function addComment(postId, text) {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          comments: [
            {
              id: crypto.randomUUID(),
              author: currentUser.name,
              avatar: currentUser.avatar,
              text: cleanText,
              liked: false,
              likes: 0,
              replies: [],
            },
            ...post.comments,
          ],
        };
      }),
    );
  }

  function toggleCommentLike(postId, commentId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) {
              return comment;
            }

            return {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            };
          }),
        };
      }),
    );
  }

  function addReply(postId, commentId, text) {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) {
              return comment;
            }

            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: crypto.randomUUID(),
                  author: currentUser.name,
                  avatar: currentUser.avatar,
                  text: cleanText,
                },
              ],
            };
          }),
        };
      }),
    );
  }

  const value = {
    posts,
    currentUser,
    register,
    login,
    logout,
    addPost,
    togglePostLike,
    sharePost,
    addComment,
    toggleCommentLike,
    addReply,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}
