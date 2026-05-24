import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Profile = () => {
  const { user, loginUser, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : null);
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const bg = isDark ? '#0f1117' : '#f9fafb';
  const cardBg = isDark ? '#1a1d27' : 'white';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textPrimary = isDark ? 'white' : '#111827';
  const textSecondary = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const sidebarBg = '#0f1117';

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: `1px solid ${inputBorder}`,
    borderRadius: '10px', fontSize: '14px',
    background: inputBg, color: textPrimary,
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    color: textSecondary, textTransform: 'uppercase',
    letterSpacing: '0.05em', marginBottom: '6px',
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setNameError('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setAvatar(file);
  };

  const handleNameSave = async () => {
    if (!name.trim()) return setNameError('Name cannot be empty');
    if (name.trim().length < 2) return setNameError('Name must be at least 2 characters');
    setNameLoading(true);
    setNameError('');
    setNameSuccess('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name.trim());
      if (avatar && typeof avatar !== 'string') formData.append('avatar', avatar);
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      loginUser(token, res.data.data);
      setNameSuccess('Profile updated successfully!');
      setTimeout(() => setNameSuccess(''), 3000);
    } catch (err) {
      setNameError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return setPassError('Please fill in all fields');
    if (newPassword !== confirmPassword)
      return setPassError('New passwords do not match');
    if (newPassword.length < 6)
      return setPassError('Password must be at least 6 characters');
    if (currentPassword === newPassword)
      return setPassError('New password must be different from current');

    setPassLoading(true);
    setPassError('');
    setPassSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(''), 3000);
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, fontFamily: 'system-ui' }}>

      {/* Sidebar */}
      <div style={{
        width: '220px', minWidth: '220px', background: sidebarBg,
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#0f1117' }}>N</div>
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>NoteApp</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '12px 8px', flex: 1 }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', marginBottom: '4px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>

          {[
            { id: 'profile', label: 'Profile Info', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { id: 'password', label: 'Change Password', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', background: activeTab === tab.id ? 'rgba(127,119,221,0.15)' : 'transparent',
                border: 'none', borderLeft: activeTab === tab.id ? '2px solid #7f77dd' : '2px solid transparent',
                color: activeTab === tab.id ? '#7f77dd' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', cursor: 'pointer', borderRadius: '0 8px 8px 0', marginBottom: '2px',
              }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Theme + Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={toggleTheme}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: textPrimary, marginBottom: '4px' }}>Profile Info</h2>
              <p style={{ fontSize: '13px', color: textSecondary, marginBottom: '28px' }}>Update your name and profile picture</p>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '20px', background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: avatarPreview ? 'transparent' : '#534AB7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', fontWeight: 700, color: 'white', overflow: 'hidden',
                    border: '3px solid rgba(127,119,221,0.3)',
                  }}>
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : user?.name?.charAt(0).toUpperCase()
                    }
                  </div>
                  <button onClick={() => fileRef.current.click()}
                    style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: '#534AB7', border: '2px solid ' + cardBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: textPrimary }}>{user?.name}</div>
                  <div style={{ fontSize: '13px', color: textSecondary, marginTop: '2px' }}>{user?.email}</div>
                  <div style={{ fontSize: '11px', color: textSecondary, marginTop: '6px' }}>
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Name field */}
              <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, padding: '20px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email address</label>
                  <input
                    type="email" value={user?.email || ''} disabled
                    style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
                  />
                  <p style={{ fontSize: '11px', color: textSecondary, marginTop: '4px' }}>Email cannot be changed</p>
                </div>

                {nameError && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>{nameError}</div>}
                {nameSuccess && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>{nameSuccess}</div>}

                <button onClick={handleNameSave} disabled={nameLoading}
                  style={{
                    padding: '10px 20px', background: '#0f1117', color: 'white',
                    border: 'none', borderRadius: '10px', fontSize: '13px',
                    fontWeight: 500, cursor: nameLoading ? 'not-allowed' : 'pointer',
                    opacity: nameLoading ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!nameLoading) e.currentTarget.style.background = '#534AB7'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0f1117'; }}>
                  {nameLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: textPrimary, marginBottom: '4px' }}>Change Password</h2>
              <p style={{ fontSize: '13px', color: textSecondary, marginBottom: '28px' }}>
                {user?.authProvider === 'google' ? 'Your account uses Google sign-in. No password to change.' : 'Choose a strong password at least 6 characters long.'}
              </p>

              {user?.authProvider === 'google' ? (
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, padding: '24px', textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p style={{ fontSize: '14px', color: textSecondary }}>You signed in with Google. Password management is handled by Google.</p>
                </div>
              ) : (
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, padding: '20px' }}>
                  {[
                    { label: 'Current password', value: currentPassword, setter: setCurrentPassword },
                    { label: 'New password', value: newPassword, setter: setNewPassword },
                    { label: 'Confirm new password', value: confirmPassword, setter: setConfirmPassword },
                  ].map(({ label, value, setter }) => (
                    <div key={label} style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type="password" value={value} onChange={e => setter(e.target.value)}
                        placeholder="••••••••" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                        onBlur={e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  ))}

                  {passError && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>{passError}</div>}
                  {passSuccess && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' }}>{passSuccess}</div>}

                  <button onClick={handlePasswordChange} disabled={passLoading}
                    style={{
                      padding: '10px 20px', background: '#0f1117', color: 'white',
                      border: 'none', borderRadius: '10px', fontSize: '13px',
                      fontWeight: 500, cursor: passLoading ? 'not-allowed' : 'pointer',
                      opacity: passLoading ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (!passLoading) e.currentTarget.style.background = '#534AB7'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#0f1117'; }}>
                    {passLoading ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;