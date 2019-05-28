import Octokit from '@octokit/rest';

export type PR = Octokit.PullsGetResponse;
export type Issue = Octokit.IssuesGetResponse | PR;
export type Comment = Octokit.IssuesListCommentsResponseItem;

export interface AssignEvent extends Octokit.IssuesListEventsForRepoResponseItem {
  assigner: Octokit.IssuesListEventsResponseItemActor;
  assignee: Octokit.IssuesListEventsResponseItemActor;
}

export interface ReviewRequestedEvent extends Octokit.IssuesListEventsForRepoResponseItem {
  requested_reviewer?: Octokit.IssuesListEventsResponseItemActor;
  requested_team?: Octokit.TeamsListResponseItem;
  review_requester: Octokit.IssuesListEventsResponseItemActor;
}

export interface LabelEvent extends Octokit.IssuesListEventsForRepoResponseItem {
  label: {
    name: string;
    color: string;
  };
}

export type Event =
  | Octokit.IssuesListEventsResponseItem
  | LabelEvent
  | ReviewRequestedEvent
  | AssignEvent;
