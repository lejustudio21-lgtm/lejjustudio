import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from '@/lib/LanguageContext';
// Add page imports here
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Frecuencias from '@/pages/Frecuencias';
import Meditaciones from '@/pages/Meditaciones';
import Podcasts from '@/pages/Podcasts';
import Raices from '@/pages/Raices';
import Comunidad from '@/pages/Comunidad';
import Numerologia from '@/pages/Numerologia';
import Rituales from '@/pages/Rituales';
import Cursos from '@/pages/Cursos';
import Videoconferencias from '@/pages/Videoconferencias';
import Tienda from '@/pages/Tienda';
import Sobre from '@/pages/Sobre';
import Contacto from '@/pages/Contacto';
import Perfil from '@/pages/Perfil';
import Admin from '@/pages/Admin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/frecuencias" element={<Frecuencias />} />
        <Route path="/meditaciones" element={<Meditaciones />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/raices" element={<Raices />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/numerologia" element={<Numerologia />} />
        <Route path="/rituales" element={<Rituales />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/videoconferencias" element={<Videoconferencias />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </LanguageProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App