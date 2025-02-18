import { useCallback, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppLoading } from '../components';
import { useAuthWatchdog, useIsAuthenticated } from '../hooks';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const Routes = () => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const isAuthenticated = useIsAuthenticated();

  const afterLogin = useCallback(() => {
    setRefresh((old) => old + 1); 
    setLoading(false);
  }, []);

  const afterLogout = useCallback(() => {
    setRefresh((old) => old + 1); 
    setLoading(false);
  }, []);

  useAuthWatchdog(afterLogin, afterLogout);

  if (loading) {
    return <AppLoading />;
  }

  console.log(`Routes() - isAuthenticated: ${isAuthenticated}, refreshCount: ${refresh}`);
  return (
    <BrowserRouter>{isAuthenticated ? <PrivateRoutes key={refresh} /> : <PublicRoutes key={refresh} />}</BrowserRouter>
  );
};
export default Routes;
