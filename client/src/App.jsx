import { Route, Routes } from 'react-router-dom';
import useLenis from './hooks/useLenis.js';
import SiteLayout from './components/layout/SiteLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Reels from './pages/Reels.jsx';
import Videos from './pages/Videos.jsx';
import Designs from './pages/Designs.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';

const App = () => {
  useLenis();

  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="reels" element={<Reels />} />
        <Route path="videos" element={<Videos />} />
        <Route path="designs" element={<Designs />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
