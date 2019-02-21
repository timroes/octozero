// @ts-ignore
import { EuiListGroup, EuiListGroupItem } from '@elastic/eui';
import React from 'react';

// declare module '@elastic/eui' {
//   interface EuiListGroupItemProps {
//     iconType: string;
//     isActive?: boolean;
//     label: string;
//     href: string;
//   }

//   export const EuiListGroupItem: React.SFC<EuiListGroupItemProps>;
// }

interface SidebarProps {
  className?: string;
}

export function Sidebar(props: SidebarProps) {
  return (
    // @ts-ignore
    <EuiListGroup flush={true} className={props.className}>
      <EuiListGroupItem iconType="bell" isActive={true} label="Inbox" href="#" />
    </EuiListGroup>
  );
}
