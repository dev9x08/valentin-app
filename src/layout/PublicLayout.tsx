import { FunctionComponent, PropsWithChildren, useCallback, useState } from 'react';
import { Stack } from '@mui/material/';
import { useAppStore } from '../store/AppStore';
import { ErrorBoundary, AppIconButton } from '../components';
import { LinkToPage } from '../utils/type';
import { useOnMobile } from '../hooks/layout';
import { BOTTOM_BAR_DESKTOP_VISIBLE, TOP_BAR_DESKTOP_HEIGHT, TOP_BAR_MOBILE_HEIGHT } from './config';
import { useEventSwitchDarkMode } from '../hooks/event';
import TopBar from './TopBar';
import SideBar from './SideBar';
import BottomBar from './BottomBar';

const TITLE_PUBLIC = 'WELCOME VALENTIN!'; 

const SIDE_BAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'Log In',
    path: '/auth/login',
    icon: 'login',
  },
  {
    title: 'Sign Up',
    path: '/auth/signup',
    icon: 'signup',
  },
  {
    title: 'About',
    path: '/about',
    icon: 'info',
  },
];

const BOTTOM_BAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'Log In',
    path: '/auth/login',
    icon: 'login',
  },
  {
    title: 'Sign Up',
    path: '/auth/signup',
    icon: 'signup',
  },
  {
    title: 'About',
    path: '/about',
    icon: 'info',
  },
];

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();
  const onSwitchDarkMode = useEventSwitchDarkMode();
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [state] = useAppStore();
  const bottomBarVisible = onMobile || BOTTOM_BAR_DESKTOP_VISIBLE;

  // Variant 1 - Sidebar is static on desktop and is a drawer on mobile
  // const sidebarOpen = onMobile ? sideBarVisible : true;
  // const sidebarVariant = onMobile ? 'temporary' : 'persistent';

  // Variant 2 - Sidebar is drawer on mobile and desktop
  const sidebarOpen = sideBarVisible;
  const sidebarVariant = 'temporary';

  const title = TITLE_PUBLIC;
  document.title = title;

  const onSideBarOpen = useCallback(() => {
    if (!sideBarVisible) setSideBarVisible(true);
  }, [sideBarVisible]);

  const onSideBarClose = useCallback(() => {
    if (sideBarVisible) setSideBarVisible(false); 
  }, [sideBarVisible]);

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        paddingTop: onMobile ? TOP_BAR_MOBILE_HEIGHT : TOP_BAR_DESKTOP_HEIGHT,
      }}
    >
      <Stack component="header">
        <TopBar
          startNode={<AppIconButton icon="logo" onClick={onSideBarOpen} />}
          title={title}
          endNode={
            <AppIconButton
              icon={state.darkMode ? 'day' : 'night'} // Variant 1
              // icon="daynight" // Variant 2
              title={state.darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
              onClick={onSwitchDarkMode}
            />
          }
        />

        <SideBar
          anchor="left"
          open={sidebarOpen}
          variant={sidebarVariant}
          items={SIDE_BAR_ITEMS}
          onClose={onSideBarClose}
        />
      </Stack>

      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          padding: 1,
        }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>

      <Stack component="footer">{bottomBarVisible && <BottomBar items={BOTTOM_BAR_ITEMS} />}</Stack>
    </Stack>
  );
};

export default PublicLayout;
