declare module '@elastic/eui' {
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
}
