import { FunctionComponent, MouseEventHandler } from 'react';
import List from '@mui/material/List';
import SideBarNavItem from './SideBarNavItem';
import { LinkToPage } from '../../utils/type';

interface Props {
  items: Array<LinkToPage>;
  showIcons?: boolean;
  onClick?: MouseEventHandler;
}

const SideBarNavList: FunctionComponent<Props> = ({ items, showIcons, onClick, ...restOfProps }) => {
  return (
    <List component="nav" {...restOfProps}>
      {items.map(({ icon, path, title }) => (
        <SideBarNavItem
          key={`${title}-${path}`}
          icon={showIcons ? icon : undefined}
          path={path}
          title={title}
          onClick={onClick}
        />
      ))}
    </List>
  );
};

export default SideBarNavList;
