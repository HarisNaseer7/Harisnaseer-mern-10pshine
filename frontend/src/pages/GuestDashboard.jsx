import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MenuIcon } from '../components/Sidebar';

const GuestDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeSection, setActiveSection] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('general');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? '#0f1117' : '#f9fafb';
  const cardBg = isDark ? '#1a1d27' : 'white';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6';
  const textPrimary = isDark ? 'white' : '#111827';
  const textSecondary = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const topbarBg = isDark ? '#13151f' : 'white';
  const topbarBorder = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

  const categories = [
    { id: 'general', label: 'General', color: '#9ca3af' },
    { id: 'work', label: 'Work', color: '#378ADD' },
    { id: 'personal', label: 'Personal', color: '#639922' },
    { id: 'ideas', label: 'Ideas', color: '#534AB7' },
  ];

  const navItems = [
    { id: 'all', label: 'All notes', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { id: 'pinned', label: 'Pinned', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  ];

  const handleCreateOrUpdate = () => {
    if (!title.trim() || !content.trim()) return;
    if (editId) {
      setNotes(notes.map(n => n.id === editId ? { ...n, title, content, category } : n));
      setEditId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content, category, isPinned: false, createdAt: new Date().toISOString() }]);
    }
    setTitle('');
    setContent('');
    setCategory('general');
    setShowEditor(false);
  };

  const handleSaveAttempt = () => {
    setShowSignupPopup(true);
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || 'general');
    setShowEditor(true);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handlePin = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const filteredNotes = notes.filter(n => {
    if (activeSection === 'pinned') return n.isPinned;
    return true;
  }).filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, fontFamily: 'system-ui', position: 'relative' }}>

      {/* Signup Popup */}
      {showSignupPopup && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: cardBg, borderRadius: '16px', padding: '32px',
            maxWidth: '400px', width: '90%', border: `1px solid ${cardBorder}`,
            textAlign: 'center',
          }}>
            {/* Icon */}
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 600, color: textPrimary, marginBottom: '8px' }}>
              Sign up to save your notes
            </h3>
            <p style={{ fontSize: '13px', color: textSecondary, marginBottom: '24px', lineHeight: 1.6 }}>
              You're in guest mode — your notes are stored temporarily and will be lost when you leave. Create a free account to save them forever.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => navigate('/register')}
                style={{ width: '100%', padding: '11px', background: '#0f1117', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#534AB7'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f1117'}>
                Create free account →
              </button>
              <button onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '11px', background: 'transparent', color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                Sign in to existing account
              </button>
              <button onClick={() => setShowSignupPopup(false)}
                style={{ width: '100%', padding: '8px', background: 'transparent', color: textSecondary, border: 'none', fontSize: '13px', cursor: 'pointer' }}>
                Continue editing (notes won't be saved)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {mobileSidebarOpen && <div className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} />}
      <div className={`app-sidebar${mobileSidebarOpen ? ' is-open' : ''}`} style={{ width: '220px', minWidth: '220px', background: '#0f1117', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#0f1117' }}>N</div>
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>NoteApp</span>
          </div>
        </div>

        {/* Guest badge */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>Guest User</div>
              <div style={{ color: 'rgba(255,200,0,0.7)', fontSize: '10px' }}>⚠ Notes not saved</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '12px', width: '100%' }} />
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '0 8px' }}>
          {navItems.map(item => (
            <div key={item.id} onClick={() => { setActiveSection(item.id); setMobileSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                background: activeSection === item.id ? 'rgba(127,119,221,0.15)' : 'transparent',
                color: activeSection === item.id ? '#7f77dd' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', marginBottom: '2px',
                borderLeft: activeSection === item.id ? '2px solid #7f77dd' : '2px solid transparent',
              }}>
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'all' && (
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '1px 6px', borderRadius: '10px' }}>
                  {notes.length}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: '8px' }}>CATEGORIES</div>
          {categories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
              <span>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={toggleTheme}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            {isDark ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
          <button onClick={() => navigate('/login')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Sign in
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px', padding: '16px 24px', background: topbarBg, borderBottom: `1px solid ${topbarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sidebar-toggle-btn" onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu" style={{ color: textPrimary }}>
              <MenuIcon />
            </button>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: textPrimary, margin: 0 }}>
              {activeSection === 'pinned' ? 'Pinned' : 'All notes'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: isDark ? 'rgba(255,200,0,0.1)' : '#fffbeb', border: '1px solid rgba(255,200,0,0.3)', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px' }}>⚠️</span>
              <span style={{ fontSize: '12px', color: isDark ? 'rgba(255,200,0,0.8)' : '#92400e' }}>Guest mode — notes not saved</span>
            </div>
            <button onClick={() => navigate('/register')}
              style={{ padding: '8px 14px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
              onMouseLeave={e => e.currentTarget.style.background = '#534AB7'}>
              Sign up free
            </button>
            <button onClick={() => { setShowEditor(true); setEditId(null); setTitle(''); setContent(''); setCategory('general'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#0f1117', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#534AB7'}
              onMouseLeave={e => e.currentTarget.style.background = '#0f1117'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New note
            </button>
          </div>
        </div>

        {/* Note Editor Modal */}
        {showEditor && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: cardBg, borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '560px', border: `1px solid ${cardBorder}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: textPrimary, margin: 0 }}>{editId ? 'Edit note' : 'New note'}</h2>
                <button onClick={() => setShowEditor(false)} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer', fontSize: '18px' }}>✕</button>
              </div>

              {/* Category picker */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                      background: category === cat.id ? cat.color + '25' : 'transparent',
                      color: category === cat.id ? cat.color : textSecondary,
                      border: `1px solid ${category === cat.id ? cat.color : inputBorder}`,
                    }}>
                    {cat.label}
                  </button>
                ))}
              </div>

              <input type="text" placeholder="Note title..." value={title} onChange={e => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${inputBorder}`, borderRadius: '10px', fontSize: '16px', fontWeight: 600, color: textPrimary, background: inputBg, outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
              />
              <textarea placeholder="Write your note here..." value={content} onChange={e => setContent(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', color: textPrimary, background: inputBg, outline: 'none', minHeight: '160px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'system-ui', lineHeight: 1.6 }}
                onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = inputBorder; e.target.style.boxShadow = 'none'; }}
              />

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowEditor(false)}
                  style={{ padding: '9px 16px', background: 'transparent', border: `1px solid ${inputBorder}`, borderRadius: '8px', fontSize: '13px', color: textSecondary, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => { handleCreateOrUpdate(); }}
                  style={{ padding: '9px 16px', background: 'transparent', border: `1px solid ${inputBorder}`, borderRadius: '8px', fontSize: '13px', color: textPrimary, cursor: 'pointer' }}>
                  {editId ? 'Update' : 'Add to session'}
                </button>
                <button onClick={handleSaveAttempt}
                  style={{ padding: '9px 16px', background: '#0f1117', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#534AB7'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0f1117'}>
                  Save note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px 24px', borderBottom: `1px solid ${topbarBorder}`, background: topbarBg }}>
          {[
            { label: 'Session notes', value: notes.length, sub: 'not saved to account' },
            { label: 'Pinned', value: notes.filter(n => n.isPinned).length, sub: 'in this session' },
            { label: 'Guest mode', value: 'Active', sub: 'sign up to save' },
          ].map(stat => (
            <div key={stat.label} style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${cardBorder}` }}>
              <div style={{ fontSize: '11px', color: textSecondary, marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: textPrimary }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: textSecondary, marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Notes Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {filteredNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: textPrimary, marginBottom: '6px' }}>No notes yet</p>
              <p style={{ fontSize: '13px', color: textSecondary, marginBottom: '20px' }}>Create a note to try out NoteApp — but remember to sign up to save them!</p>
              
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {filteredNotes.map(note => (
                <div key={note.id} style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, padding: '16px', position: 'relative' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = cardBorder}>

                  {note.isPinned && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#534AB7" stroke="#534AB7" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, margin: 0, paddingRight: note.isPinned ? '20px' : 0 }}>{note.title}</h3>
                    <span style={{ fontSize: '11px', color: textSecondary, whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatDate(note.createdAt)}</span>
                  </div>

                  <p style={{ fontSize: '12px', color: textSecondary, lineHeight: 1.6, marginBottom: '12px', height: '38px', overflow: 'hidden' }}>
                    {note.content.substring(0, 80)}...
                  </p>

                  {/* Category */}
                  <div style={{ marginBottom: '10px' }}>
                    {(() => {
                      const cat = categories.find(c => c.id === note.category) || categories[0];
                      return <span style={{ fontSize: '11px', padding: '3px 8px', background: cat.color + '20', color: cat.color, borderRadius: '20px', fontWeight: 500 }}>{cat.label}</span>;
                    })()}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleEdit(note)} style={{ padding: '5px 10px', background: 'transparent', border: `1px solid ${inputBorder}`, borderRadius: '6px', fontSize: '11px', color: textPrimary, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handlePin(note.id)} style={{ padding: '5px 10px', background: note.isPinned ? 'rgba(83,74,183,0.1)' : 'transparent', border: `1px solid ${note.isPinned ? '#534AB7' : inputBorder}`, borderRadius: '6px', fontSize: '11px', color: note.isPinned ? '#534AB7' : textSecondary, cursor: 'pointer' }}>
                      {note.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button onClick={handleSaveAttempt} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #534AB7', borderRadius: '6px', fontSize: '11px', color: '#534AB7', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => handleDelete(note.id)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '11px', color: '#dc2626', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;