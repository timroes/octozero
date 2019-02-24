import React from 'react';

import { Sidebar } from '../navigation';
import { NotificationList } from '../notifications';

import css from './dashboard.module.scss';

export function Dashboard() {
  return (
    <div className={css.dashboard}>
      <Sidebar className={css.dashboard__sidebar} />
      <main className={css.dashboard__main}>
        <NotificationList />
      </main>
    </div>
  );
}
