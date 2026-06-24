import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const categories = [
  { id: 'work', label: 'Work', color: '#378ADD' },
  { id: 'personal', label: 'Personal', color: '#639922' },
  { id: 'ideas', label: 'Ideas', color: '#534AB7' },
  { id: 'general', label: 'General', color: '#9ca3af' },
];

const navItems = [
  { id: 'all', label: 'All notes', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id: 'pinned', label: 'Pinned', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { id: 'archived', label: 'Archived', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg> },
  { id: 'trash', label: 'Trash', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> },
];

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const sidebarBtnStyle = {
  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
  padding: '8px 10px', background: 'transparent', border: 'none',
  color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px',
};

const Sidebar = ({
  // Dashboard mode props
  activeSection,
  setActiveSection,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  notes,
  // Editor/Profile mode props
  mode = 'dashboard', // 'dashboard' | 'editor' | 'profile'
  activeTab,
  setActiveTab,
  // Children slot for extra content
  children,
  // Mobile drawer controls
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const selectAndClose = (fn) => {
    fn();
    onCloseMobile?.();
  };

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`)
    : null;

  return (
    <>
    {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
    <div className={`app-sidebar${mobileOpen ? ' is-open' : ''}`} style={{
      width: '220px', minWidth: '220px', background: '#0f1117',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'white', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px', color: '#0f1117',
          }}>N</div>
          <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>NoteApp</span>
        </div>
      </div>

      {/* User */}
      <div
        style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
        onClick={() => selectAndClose(() => navigate('/profile'))}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', background: '#534AB7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '13px', fontWeight: 600, overflow: 'hidden',
          }}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : user?.name?.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Dashboard mode — search + nav + categories */}
      {mode === 'dashboard' && (
        <>
          {/* Search */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.06)', borderRadius: '8px',
              padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" placeholder="Search notes..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '12px', width: '100%' }}
              />
            </div>
          </div>

          {/* Nav Items */}
          <div style={{ padding: '0 8px' }}>
            {navItems.map(item => (
              <div key={item.id}
                onClick={() => selectAndClose(() => { setActiveSection(item.id); setActiveCategory(''); })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                  background: activeSection === item.id && !activeCategory ? 'rgba(127,119,221,0.15)' : 'transparent',
                  color: activeSection === item.id && !activeCategory ? '#7f77dd' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px', marginBottom: '2px',
                  borderLeft: activeSection === item.id && !activeCategory ? '2px solid #7f77dd' : '2px solid transparent',
                }}>
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'all' && notes && (
                  <span style={{
                    marginLeft: 'auto', background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.4)', fontSize: '11px',
                    padding: '1px 6px', borderRadius: '10px',
                  }}>
                    {notes.filter(n => !n.isTrashed && !n.isArchived).length}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Categories */}
          <div style={{ padding: '12px 16px 8px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              CATEGORIES
            </div>
            {categories.map(cat => (
              <div key={cat.id}
                onClick={() => selectAndClose(() => { setActiveCategory(activeCategory === cat.id ? '' : cat.id); setActiveSection('all'); })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '7px 10px', borderRadius: '8px', cursor: 'pointer',
                  color: activeCategory === cat.id ? 'white' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px', marginBottom: '2px',
                  background: activeCategory === cat.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Editor mode — back button + category picker slot */}
      {mode === 'editor' && (
        <div style={{ padding: '12px 16px', flex: 1 }}>
          <button
            onClick={() => selectAndClose(() => navigate('/dashboard'))}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 10px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer',
              marginBottom: '16px', width: '100%',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to notes
          </button>
          {children}
        </div>
      )}

      {/* Profile mode — tabs */}
      {mode === 'profile' && (
        <div style={{ padding: '12px 8px', flex: 1 }}>
          <button
            onClick={() => selectAndClose(() => navigate('/dashboard'))}
            style={{ ...sidebarBtnStyle, color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Dashboard
          </button>

          {[
            { id: 'profile', label: 'Profile Info', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { id: 'password', label: 'Change Password', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
          ].map(tab => (
            <button key={tab.id} onClick={() => selectAndClose(() => setActiveTab(tab.id))}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px',
                background: activeTab === tab.id ? 'rgba(127,119,221,0.15)' : 'transparent',
                border: 'none',
                borderLeft: activeTab === tab.id ? '2px solid #7f77dd' : '2px solid transparent',
                color: activeTab === tab.id ? '#7f77dd' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', cursor: 'pointer', borderRadius: '0 8px 8px 0', marginBottom: '2px',
              }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Theme + Logout — always shown */}
      <div style={{
        marginTop: mode === 'dashboard' ? 'auto' : 0,
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        <button onClick={toggleTheme} style={sidebarBtnStyle}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
          {isDark ? <SunIcon /> : <MoonIcon />}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
        <button onClick={handleLogout} style={sidebarBtnStyle}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
export { categories, navItems, MenuIcon };