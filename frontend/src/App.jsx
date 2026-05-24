import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GuestDashboard from './pages/GuestDashboard';
import NoteEditor from './pages/NoteEditor';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/forgot-password', '/reset-password', '/dashboard', '/notes/new', '/auth/callback', '/profile', '/guest'].includes(location.pathname) || location.pathname.startsWith('/notes/');

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path='/login' element={user ? <Navigate to='/dashboard' /> : <Login />} />
        <Route path='/register' element={user ? <Navigate to='/dashboard' /> : <Register />} />
        <Route path='/guest' element={user ? <Navigate to='/dashboard' /> : <GuestDashboard />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/auth/callback' element={<AuthCallback />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/notes/new' element={<PrivateRoute><NoteEditor /></PrivateRoute>} />
        <Route path='/notes/:id' element={<PrivateRoute><NoteEditor /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;