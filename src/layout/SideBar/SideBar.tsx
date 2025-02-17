import { FunctionComponent, useCallback, MouseEvent } from 'react';
import { Stack, Divider, Drawer, DrawerProps, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { AppIconButton } from '../../components';
import { useAppStore } from '../../store/AppStore';
import { LinkToPage } from '../../utils/type';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '../../hooks';
import SideBarNavList from './SideBarNavList';
import { SIDE_BAR_WIDTH, TOP_BAR_DESKTOP_HEIGHT } from '../config';
import UserInfo from '../../components/UserInfo';

interface Props extends Pick<DrawerProps, 'anchor' | 'className' | 'open' | 'variant' | 'onClose'> {
  items: Array<LinkToPage>;
}

const SideBar: FunctionComponent<Props> = ({ anchor, open, variant, items, onClose, ...restOfProps }) => {
  const [state] = useAppStore();
  const isAuthenticated = useIsAuthenticated(); 
  const onMobile = useOnMobile();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  const handleAfterLinkClick = useCallback(
    (event: MouseEvent) => {
      if (variant === 'temporary' && typeof onClose === 'function') {
        onClose(event, 'backdropClick');
      }
    },
    [variant, onClose]
  );

  return (
    <Drawer
      anchor={anchor}
      open={open}
      variant={variant}
      PaperProps={{
        sx: {
          width: SIDE_BAR_WIDTH,
          marginTop: onMobile ? 0 : variant === 'temporary' ? 0 : TOP_BAR_DESKTOP_HEIGHT,
          height: onMobile ? '100%' : variant === 'temporary' ? '100%' : `calc(100% - ${TOP_BAR_DESKTOP_HEIGHT})`,
          zIndex:'9999'
        },
      }}
      onClose={onClose}
    >
      <Stack
        sx={{
          height: '100%',
          padding: 2,
        }}
        {...restOfProps}
        onClick={handleAfterLinkClick}
      >
        {isAuthenticated && (
          <>
            <UserInfo showAvatar />
            <Divider />
          </>
        )}

        <SideBarNavList items={items} showIcons />

        <Divider />

        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 2,
          }}
        >
          <Tooltip title={state.darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}>
            <FormControlLabel
              label={!state.darkMode ? 'Light mode' : 'Dark mode'}
              control={<Switch checked={state.darkMode} onChange={onSwitchDarkMode} />}
            />
          </Tooltip>

          {isAuthenticated && <AppIconButton icon="logout" title="Logout Current User" onClick={onLogout} />}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default SideBar;
