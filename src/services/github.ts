import Octokit, { ActivityListNotificationsForRepoParams, ActivityListNotificationsForRepoResponseItem } from '@octokit/rest';
import moment from 'moment';
import React, { useContext } from 'react';
import { getLogin, loginToken$ } from './login';

import { Comment, Event, Issue, Notification, User } from '../types';

const OCTOKIT_OPTIONS = {
  // TODO: Deprecated, how can we disable caching now, since it's not workign properly
  headers: {
    'if-none-match': '',
  },
};

function getReposFromLocationSearch(search: string): ActivityListNotificationsForRepoParams[] | undefined {
  const urlParams = new URLSearchParams(search);
  const repoList = urlParams.get('repos');
  if (!repoList) {
    return undefined;
  }
  return repoList.split(',').reduce<ActivityListNotificationsForRepoParams[]>((acc, repoName)=> {
    if (repoName.indexOf('/') >= 0) {
      const [owner, repo] = repoName.split('/');
      return [...acc, {
        owner,
        repo,
      }]
    }
    return acc;
  }, []);
}

class GitHubApi {
  private octokit: Octokit;

  constructor() {
    // TODO: Initialization without token
    this.octokit = new Octokit({
      auth: `token ${getLogin() || ''}`,
      ...OCTOKIT_OPTIONS,
    });

    loginToken$.subscribe(token => {
      this.octokit = new Octokit({
        auth: `token ${token || ''}`,
        ...OCTOKIT_OPTIONS,
      });
    });
  }

  public async getUser(): Promise<User> {
    const user = await this.octokit.users.getAuthenticated();
    return user.data;
  }

  public async getUnreadNotifications(repoList?: ActivityListNotificationsForRepoParams[]): Promise<Notification[]> {
    if (!repoList || repoList.length === 0) {
      return this.getAllUnreadNotification();
    }
    return this.getUnreadNotificationFromRepos(repoList);
  }

  public async getAllUnreadNotification(): Promise<Notification[]> {
    const notifications = await this.octokit.activity.listNotifications({per_page: 100});
    return notifications.data;
  }

  public async getUnreadNotificationFromRepos(repos: ActivityListNotificationsForRepoParams[]): Promise<Notification[]> {
    const notifications = await Promise.all(repos.map(repo => {
      return this.octokit.activity.listNotificationsForRepo(repo);
    }))
    return notifications.reduce<ActivityListNotificationsForRepoResponseItem[]>((acc, d) => {
      return [...acc, ...d.data]
    }, []);
  }

  public async getIssueForNotification(notification: Notification): Promise<Issue> {
    return (await this.octokit.request(notification.subject.url)).data;
  }

  public async markNotificationAsRead(threadId: string): Promise<{}> {
    const response = await this.octokit.activity.markThreadAsRead({ thread_id: Number(threadId) });
    return response.data;
  }

  public async unsubscribeNotification(notification: Notification): Promise<void> {
    await this.octokit.activity.deleteThreadSubscription({ thread_id: Number(notification.id) });
  }

  public async loadIssueChanges(
    owner: string,
    repo: string,
    issue: number,
    since?: string
  ): Promise<Array<Comment | Event>> {
    const params: Octokit.IssuesListCommentsParams = {
      issue_number: issue,
      owner,
      per_page: 100,
      repo,
    };
    if (since) {
      params.since = since;
    }
    const [comments, events] = await Promise.all([
      this.octokit.issues.listComments(params),
      this.octokit.issues.listEvents(params),
    ]);

    const filteredEvents = since
      ? events.data.filter(event => moment(event.created_at).isSameOrAfter(since))
      : events.data;

    const changes = [...comments.data, ...filteredEvents];

    changes.sort((a, b) => {
      const utcA = moment(a.created_at).utc();
      const utcB = moment(b.created_at).utc();
      if (utcA > utcB) {
        return 1;
      } else if (utcB > utcA) {
        return -1;
      } else {
        return 0;
      }
    });

    return changes;
  }
}

const GitHubContext = React.createContext<GitHubApi>(new GitHubApi());

function useGitHub() {
  return useContext(GitHubContext);
}

export { GitHubApi, GitHubContext, useGitHub, getReposFromLocationSearch };
