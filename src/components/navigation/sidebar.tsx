import { EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import React from 'react';

interface SidebarProps {
  className?: string;
}

export function Sidebar(props: SidebarProps) {
  return (
    <EuiListGroup flush={true} className={props.className}>
      <EuiListGroupItem iconType="bell" isActive={true} label="Inbox" href="#" />
    </EuiListGroup>
  );
}
