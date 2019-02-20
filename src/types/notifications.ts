import Octokit from '@octokit/rest';

export interface Notification extends Octokit.ActivityListNotificationsForRepoResponseItem {
  issue: Octokit.IssuesGetResponse | Octokit.PullsGetResponse;
}
