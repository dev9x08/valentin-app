
import { AppView } from '../../components';

const DevView = () => {
  if (process.env.REACT_APP_DEBUG !== 'true') return null;

  return <AppView>Debug controls and components on this page...</AppView>;
};

export default DevView;
