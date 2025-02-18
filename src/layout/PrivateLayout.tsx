import { useState, useCallback, FunctionComponent, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { AppIconButton, ErrorBoundary } from '../components';
import { LinkToPage } from '../utils/type';
import { useOnMobile } from '../hooks/layout';
import {
  SIDE_BAR_DESKTOP_ANCHOR,
  SIDE_BAR_MOBILE_ANCHOR,
  SIDE_BAR_WIDTH,
  TOP_BAR_DESKTOP_HEIGHT,
  TOP_BAR_MOBILE_HEIGHT,
} from './config';
import TopBar from './TopBar';
import SideBar from './SideBar';

const TITLE_PRIVATE = 'VALENTIN COMMUNITY'; 

const SIDE_BAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'Profile (404)',
    path: '/user',
    icon: 'account',
  },
  {
    title: 'About',
    path: '/about',
    icon: 'info',
  },
];

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const navigation = useNavigate();
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const onMobile = useOnMobile();

  const sidebarOpen = sideBarVisible;
  const sidebarVariant = 'temporary';

  const title = TITLE_PRIVATE;
  document.title = title; 

  const onLogoClick = useCallback(() => {
    navigation(SIDE_BAR_ITEMS?.[0]?.path || '/');
  }, [navigation]);

  const onSideBarOpen = () => {
    if (!sideBarVisible) setSideBarVisible(true);
  };

  const onSideBarClose = () => {
    if (sideBarVisible) setSideBarVisible(false);
  };

  return (
    <Stack
      direction="column"
      sx={{
        minHeight: '100vh',
        paddingTop: onMobile ? TOP_BAR_MOBILE_HEIGHT : TOP_BAR_DESKTOP_HEIGHT,
        paddingLeft: sidebarOpen && !onMobile ? 0 : 0,
        paddingRight: sidebarOpen && onMobile ? SIDE_BAR_WIDTH : 0, 
      }}
    >
      <Stack component="header">
        <TopBar
          startNode={<AppIconButton icon="logo" onClick={sidebarOpen ? onLogoClick : onSideBarOpen} />}
          title={title}
        />

        <SideBar
          anchor={onMobile ? SIDE_BAR_MOBILE_ANCHOR : SIDE_BAR_DESKTOP_ANCHOR}
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
          paddingLeft: 1,
          paddingRight: 1,
          paddingTop: 1,
        }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default PrivateLayout;
