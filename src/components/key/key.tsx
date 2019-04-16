import React from 'react';

import css from './key.module.scss';

export function Key({ children }: { children: React.ReactChild }) {
  return <kbd className={css.key}>{children}</kbd>;
}
