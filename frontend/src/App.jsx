import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GuestDashboard from './pages/GuestDashboard';
import NoteEditor from './pages/NoteEditor';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path='/' element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      <Route path='/login' element={user ? <Navigate to='/dashboard' /> : <Login />} />
      <Route path='/register' element={user ? <Navigate to='/dashboard' /> : <Register />} />
      <Route path='/guest' element={user ? <Navigate to='/dashboard' /> : <GuestDashboard />} />
      <Route
        path='/dashboard'
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path='/notes/new'
        element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        }
      />
      <Route
        path='/notes/:id'
        element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;