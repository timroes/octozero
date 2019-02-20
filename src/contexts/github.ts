import React from 'react';
import { GitHubApi } from '../services/github';

export const GitHubContext = React.createContext<GitHubApi>(new GitHubApi());