import React, { useState } from 'react';

import { Sidebar } from './sidebar';
import { NotificationList } from '../notifications';

import css from './dashboard.module.scss';

export function Dashboard() {
  const [notificationCount, setNotificationCount] = useState<number | undefined>(undefined);

  return (
    <div className={css.dashboard}>
      <Sidebar className={css.dashboard__sidebar} inboxTotal={notificationCount}/>
      <main className={css.dashboard__main}>
        <NotificationList onNotificationsChange={(nots) => setNotificationCount(nots.length)}/>
      </main>
    </div>
  );
}
