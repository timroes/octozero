import React from 'react';

import { EuiAccordion, EuiSpacer, EuiTitle } from '@elastic/eui';

interface HelpSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function HelpSection({ children, title, id }: HelpSectionProps) {
  return (
    <EuiAccordion
      id={`helpSection-${id}`}
      buttonContent={
        <EuiTitle size="s">
          <h2>{title}</h2>
        </EuiTitle>
      }
    >
      <EuiSpacer size="s" />
      {children}
    </EuiAccordion>
  );
}
