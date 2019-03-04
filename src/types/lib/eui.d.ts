declare module '@elastic/eui' {
  // --- EuiHeader ---

  interface EuiHeaderSectionProps {
    side?: 'left' | 'right';
    grow?: boolean;
  }

  export const EuiHeaderSection: React.FunctionComponent<EuiHeaderSection>;

  interface EuiHeaderSectionItemProps {
    border?: 'left' | 'right' | 'none';
  }

  export const EuiHeaderSectionItem: React.FunctionComponent<EuiHeaderSectionItemProps>;

  interface EuiHeaderSectionItemButtonProps {
    onClick?: () => void;
  }

  export const EuiHeaderSectionItemButton: React.FunctionComponent<EuiHeaderSectionItemButtonProps>;

  // --- List Group ---

  interface EuiListGroupItemProps {
    iconType: string;
    isActive?: boolean;
    label: string;
    href: string;
  }

  export const EuiListGroupItem: React.FunctionComponent<EuiListGroupItemProps>;

  interface EuiListGroupProps {
    flush?: boolean;
    className?: string;
  }

  export const EuiListGroup: React.FunctionComponent<EuiListGroupProps>;
}
