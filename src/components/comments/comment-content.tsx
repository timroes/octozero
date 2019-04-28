import MarkdownIt from 'markdown-it';
// @ts-ignore
import markdownEmoji from 'markdown-it-emoji';
import moment from 'moment';
import React from 'react';

import css from './comment.module.scss';

const markdown = new MarkdownIt();
markdown.use(markdownEmoji);

interface CommentContentProps {
  body: string;
  author: {
    login: string;
    avatar_url: string;
  };
  time: string;
}

export function CommentContent({ body, author, time }: CommentContentProps) {
  const renderedMarkdown = markdown.render(body);

  return (
    <div className={css.comment}>
      <div className={css.comment__meta}>
        <img aria-hidden="true" alt="" src={author.avatar_url} className={css.comment__avatar} />
        <span className={css.comment__author}>{author.login}</span> commented{' '}
        {moment(time).fromNow()}
      </div>
      <div className={css.comment__body} dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
    </div>
  );
}
