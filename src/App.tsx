import { AppThemeProvider } from './theme';
import { AppStore } from './store';
import { ErrorBoundary } from './components';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';

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
