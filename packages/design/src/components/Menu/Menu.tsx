import { FC } from 'react';
import { List } from './List';
import { IMenuProps } from './types';

export const Menu: FC<IMenuProps> = (props) => {
  return <List {...props} />;
};
