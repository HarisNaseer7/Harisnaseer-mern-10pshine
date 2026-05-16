import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-brand'>
        📝 Notes App
      </Link>
      <div className='navbar-links'>
        {user ? (
          <>
            <Link to='/profile' className='profile-link'>
              👤 {user.name}
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;