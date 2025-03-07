import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateLayout } from '../layout';
import { NotFoundView } from '../views';
import AboutView from '../views/About';
import WelcomeView from '../views/Welcome';

const PrivateRoutes = () => {
  return (
    <PrivateLayout>
      <Routes>
        <Route path="/" element={<WelcomeView />} />
        <Route
          path="auth/*"
          element={<Navigate to="/" replace />}
        />
        <Route path="about" element={<AboutView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
