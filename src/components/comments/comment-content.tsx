// @ts-ignore
import { EuiImage } from '@elastic/eui';
import moment from 'moment';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { replaceEmojis } from '../../utils/emojis';

import css from './comment.module.scss';

interface CommentContentProps {
  body: string;
  author: {
    login: string;
    avatar_url: string;
  };
  time: string;
}

function ImageComponent({ src, ...rest }: any) {
  return <EuiImage url={src} size="fullWidth" allowFullScreen={true} {...rest} />;
}

export function CommentContent({ body, author, time }: CommentContentProps) {
  const markdown = replaceEmojis(body);

  return (
    <div className={css.comment}>
      <div className={css.comment__meta}>
        <img src={author.avatar_url} className={css.comment__avatar} />
        <span className={css.comment__author}>{author.login}</span> commented{' '}
        {moment(time).fromNow()}
      </div>
      <div className={css.comment__body}>
        <ReactMarkdown
          source={markdown}
          renderers={{
            image: ImageComponent,
          }}
        />
      </div>
    </div>
  );
}
