import React from 'react';

import '@elastic/eui/dist/eui_theme_light.css';
import css from './App.module.scss';

import { GitHubContext } from './contexts/github';
import { Sidebar } from './components/navigation/sidebar';
import { NotificationList } from './components/notifications';
import { GitHubApi } from './services/github';

const github = new GitHubApi('31c721411ff319b118f25c18380223de055f3432');

function App() {
  return (
    <GitHubContext.Provider value={github}>
      <div className={css.app}>
        <Sidebar className={css.app__sidebar} />
        <main className={css.app__main}>
          <NotificationList />
        </main>
      </div>
    </GitHubContext.Provider>
  );
}

export default App;
