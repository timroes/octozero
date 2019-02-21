import React from 'react';
import { Comment } from '../../types';
import { CommentContent } from './comment-content';
import css from './comments.module.scss';

interface CommentsProps {
  comments: Comment[];
}

export function Comments({ comments }: CommentsProps) {
  return (
    <div className={css.comments}>
      {comments.map(comment => (
        <CommentContent
          key={comment.id}
          author={comment.user}
          time={comment.updated_at}
          body={comment.body}
        />
      ))}
    </div>
  );
}
