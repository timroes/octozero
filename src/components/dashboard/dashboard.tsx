import React, { useState } from 'react';
import { Location } from 'history';
import { Sidebar } from './sidebar';
import { NotificationList } from '../notifications';
import { getReposFromLocationSearch } from '../../services/github'

import css from './dashboard.module.scss';

export function Dashboard({ location }: {location: Location}) {
  const [notificationCount, setNotificationCount] = useState<number | undefined>(undefined);
  const repos = getReposFromLocationSearch(location.search);

  return (
    <div className={css.dashboard}>
      <Sidebar className={css.dashboard__sidebar} inboxTotal={notificationCount}/>
      <main className={css.dashboard__main}>
        <NotificationList onNotificationsChange={(nots) => setNotificationCount(nots.length)} repos={repos}/>
      </main>
    </div>
  );
}
