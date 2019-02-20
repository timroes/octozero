import Octokit from '@octokit/rest';

import { Notification } from '../types';

class GitHubApi {
  private octokit: Octokit;

  constructor(apiToken?: string) {
    // TODO: Initialization without token
    this.octokit = new Octokit({
      auth: `token ${apiToken}`,
    });
  }

  public async getUnreadNotifications(): Promise<Notification[]> {
    const notifications = await this.octokit.activity.listNotifications({ per_page: 100 });
    return notifications.data;
  }

  public async markNotificationAsRead(threadId: string): Promise<{}> {
    const response = await this.octokit.activity.markThreadAsRead({ thread_id: Number(threadId) });
    return response.data;
  }

  public get api() {
    return this.octokit;
  }
}

export { GitHubApi };