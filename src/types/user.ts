import Octokit from '@octokit/rest';

// Octokit currently doesn't have a typing for that
export interface User {
  login: string;
  avatar_url: string;
}
