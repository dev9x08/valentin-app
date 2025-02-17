import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layout';
import { NotFoundView } from '../views';
import AboutView from '../views/About';
import DevView from '../views/Dev';
import LoginEmailView from '../views/Auth/Login/LoginEmailView';
import AuthRoutes from '../views/Auth';


const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<LoginEmailView />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </PublicLayout>
  );
};

export default PublicRoutes;
