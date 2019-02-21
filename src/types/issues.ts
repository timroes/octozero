import Octokit from '@octokit/rest';

export type Issue = Octokit.IssuesGetResponse | Octokit.PullsGetResponse;
