export interface MenuDataItem {
  title: string;
  itemKey: string;
  position?: number;
  children?: Array<MenuDataItem>;
}

export type MenuData = Array<MenuDataItem>;

export interface IMenuProps {
  data: MenuData;
  activeKey: string;
  onItemClick: (key: string) => void;
  showIcon?: boolean;
}

export interface IMenuListProps extends IMenuProps {
  depth?: number;
}

export interface IMenuItemProps extends MenuDataItem {
  onItemClick: (key: string) => void;
  activeKey: string;
  depth: number;
  showIcon?: boolean;
}
