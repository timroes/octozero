import React from 'react';
import { EuiNotificationBadge } from '@elastic/eui';
import { NavLink } from 'react-router-dom';

import css from './sidebar.module.scss';

interface SidebarProps {
  className?: string;
  inboxTotal?: number;
}

export function Sidebar(props: SidebarProps) {
  return (
    <nav className={props.className}>
      <NavLink to="/" className={css.sidebar__link}>
        <span className={css.sidebar__linkText}>Inbox</span>
        {props.inboxTotal && <EuiNotificationBadge>{props.inboxTotal}</EuiNotificationBadge>}
      </NavLink>
    </nav>
  );
}
