import { AppThemeProvider } from './theme';
import { AppStore } from './store';
import { ErrorBoundary } from './components';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';

/**
 * Root Application Component
 * @component MainApp
 */
const MainApp = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <AppThemeProvider>
          <Routes />
          <ToastContainer />
        </AppThemeProvider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default MainApp;
