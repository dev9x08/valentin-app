import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '../..';
import LoginEmailView from './LoginEmailView';


const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginEmailView />} />
      <Route path="email" element={<LoginEmailView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default LoginRoutes;
