import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='profile-container'>
      <div className='profile-card'>
        <div className='profile-avatar'>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 className='profile-name'>{user?.name}</h2>

        <div className='profile-details'>
          <div className='profile-item'>
            <span className='profile-label'>📧 Email</span>
            <span className='profile-value'>{user?.email}</span>
          </div>

          <div className='profile-item'>
            <span className='profile-label'>📅 Member Since</span>
            <span className='profile-value'>
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </span>
          </div>

          <div className='profile-item'>
            <span className='profile-label'>👤 Account Type</span>
            <span className='profile-value'>Standard User</span>
          </div>
        </div>

        <div className='profile-actions'>
          <button onClick={() => navigate('/dashboard')} className='back-btn'>
            ← Back to Dashboard
          </button>
          <button onClick={handleLogout} className='logout-btn'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;