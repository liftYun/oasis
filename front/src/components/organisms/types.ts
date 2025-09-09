export type TabItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
  ariaLabel?: string;
};
