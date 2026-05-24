import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote, pinNote, archiveNote, trashNote, restoreNote, createNote } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [activeCategory, setActiveCategory] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const importRef = useRef();
  const exportMenuRef = useRef();

  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const bg = isDark ? '#0f1117' : '#f9fafb';
  const cardBg = isDark ? '#1a1d27' : 'white';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6';
  const textPrimary = isDark ? 'white' : '#111827';
  const textSecondary = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const topbarBg = isDark ? '#13151f' : 'white';
  const topbarBorder = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const menuBg = isDark ? '#1a1d27' : 'white';

  useEffect(() => { fetchNotes(); }, []);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data.data);
    } catch { setError('Failed to fetch notes'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this note?')) return;
    try { await deleteNote(id); fetchNotes(); }
    catch { setError('Failed to delete note'); }
  };

  const handlePin = async (id) => {
    try { await pinNote(id); fetchNotes(); }
    catch { setError('Failed to pin note'); }
  };

  const handleArchive = async (id) => {
    try { await archiveNote(id); fetchNotes(); }
    catch { setError('Failed to archive note'); }
  };

  const handleTrash = async (id) => {
    try { await trashNote(id); fetchNotes(); }
    catch { setError('Failed to trash note'); }
  };

  const handleRestore = async (id) => {
    try { await restoreNote(id); fetchNotes(); }
    catch { setError('Failed to restore note'); }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // ─── EXPORT JSON ───────────────────────────────
  const exportJSON = () => {
    const exportData = notes
      .filter(n => !n.isTrashed)
      .map(n => ({
        title: n.title,
        content: n.content,
        category: n.category,
        isPinned: n.isPinned,
        isArchived: n.isArchived,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noteapp-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // ─── EXPORT CSV ────────────────────────────────
  const exportCSV = () => {
    const headers = ['Title', 'Content', 'Category', 'Pinned', 'Archived', 'Created At'];
    const rows = notes
      .filter(n => !n.isTrashed)
      .map(n => [
        `"${n.title.replace(/"/g, '""')}"`,
        `"${n.content.replace(/<[^>]*>/g, '').replace(/"/g, '""')}"`,
        `"${n.category || 'general'}"`,
        n.isPinned ? 'Yes' : 'No',
        n.isArchived ? 'Yes' : 'No',
        `"${new Date(n.createdAt).toLocaleDateString()}"`,
      ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noteapp-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // ─── EXPORT PDF ────────────────────────────────
  const exportPDF = () => {
    const exportNotes = notes.filter(n => !n.isTrashed);
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>NoteApp Export</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #111827; }
          .header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb; }
          .logo { width: 36px; height: 36px; background: #0f1117; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; }
          .app-name { font-size: 20px; font-weight: 600; }
          .export-date { font-size: 12px; color: #6b7280; margin-left: auto; }
          .note { margin-bottom: 28px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; page-break-inside: avoid; }
          .note-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
          .note-meta { display: flex; gap: 10px; margin-bottom: 12px; }
          .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; background: #f3f4f6; color: #6b7280; }
          .note-content { font-size: 14px; line-height: 1.7; color: #374151; }
          .total { font-size: 13px; color: #6b7280; margin-bottom: 24px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">N</div>
          <span class="app-name">NoteApp</span>
          <span class="export-date">Exported on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <p class="total">${exportNotes.length} notes exported</p>
        ${exportNotes.map(n => `
          <div class="note">
            <div class="note-title">${n.title}</div>
            <div class="note-meta">
              <span class="badge">${n.category || 'general'}</span>
              ${n.isPinned ? '<span class="badge">📌 Pinned</span>' : ''}
              <span class="badge">${new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="note-content">${n.content.replace(/<[^>]*>/g, '')}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    win.onload = () => {
      win.print();
      URL.revokeObjectURL(url);
    };
    setShowExportMenu(false);
  };

  // ─── IMPORT JSON ───────────────────────────────
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportStatus('importing');
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Invalid format');

      let imported = 0;
      let failed = 0;
      for (const note of data) {
        if (!note.title || !note.content) { failed++; continue; }
        try {
          await createNote({
            title: note.title,
            content: note.content,
            category: note.category || 'general',
          });
          imported++;
        } catch { failed++; }
      }
      await fetchNotes();
      setImportStatus(`✓ Imported ${imported} notes${failed > 0 ? ` (${failed} failed)` : ''}`);
      setTimeout(() => setImportStatus(''), 4000);
    } catch {
      setImportStatus('✗ Invalid JSON file');
      setTimeout(() => setImportStatus(''), 3000);
    }
    e.target.value = '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

  const getFilteredNotes = () => {
    let filtered = notes;
    if (activeSection === 'pinned') filtered = notes.filter(n => n.isPinned && !n.isTrashed);
    else if (activeSection === 'archived') filtered = notes.filter(n => n.isArchived && !n.isTrashed);
    else if (activeSection === 'trash') filtered = notes.filter(n => n.isTrashed);
    else filtered = notes.filter(n => !n.isTrashed && !n.isArchived);
    if (activeCategory) filtered = filtered.filter(n => n.category === activeCategory);
    if (search) filtered = filtered.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
    return filtered;
  };

  const filteredNotes = getFilteredNotes();
  const sectionTitles = { all: 'All notes', pinned: 'Pinned', archived: 'Archived', trash: 'Trash' };

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, fontFamily: 'system-ui' }}>

      {/* Hidden file input for import */}
      <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />

      {/* Sidebar */}
      <div style={{ width: '220px', minWidth: '220px', background: '#0f1117', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#0f1117' }}>N</div>
            <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>NoteApp</span>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 600, overflow: 'hidden' }}>
              {user?.avatar
                ? <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user?.name?.charAt(0).toUpperCase()
              }
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{user?.email}</div>
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

        {/* Nav Items */}
        <div style={{ padding: '0 8px' }}>
          {navItems.map(item => (
            <div key={item.id} onClick={() => { setActiveSection(item.id); setActiveCategory(''); }}
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
              {item.id === 'all' && (
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '1px 6px', borderRadius: '10px' }}>
                  {notes.filter(n => !n.isTrashed && !n.isArchived).length}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: '8px' }}>CATEGORIES</div>
          {categories.map(cat => (
            <div key={cat.id} onClick={() => { setActiveCategory(activeCategory === cat.id ? '' : cat.id); setActiveSection('all'); }}
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

        {/* Theme + Logout */}
        <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={toggleTheme}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
            {isDark
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
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

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: topbarBg, borderBottom: `1px solid ${topbarBorder}` }}>
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: textPrimary, margin: 0 }}>
            {activeCategory ? categories.find(c => c.id === activeCategory)?.label : sectionTitles[activeSection]}
          </h1>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

            {/* Import status */}
            {importStatus && (
              <span style={{
                fontSize: '12px', padding: '6px 12px', borderRadius: '8px',
                background: importStatus.startsWith('✓') ? '#f0fdf4' : '#fef2f2',
                color: importStatus.startsWith('✓') ? '#16a34a' : '#dc2626',
              }}>{importStatus}</span>
            )}

            {/* Import button */}
            <button onClick={() => importRef.current.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'transparent', color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import
            </button>

            {/* Export dropdown */}
            <div style={{ position: 'relative' }} ref={exportMenuRef}>
              <button onClick={() => setShowExportMenu(!showExportMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'transparent', color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {showExportMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                  background: menuBg, border: `1px solid ${inputBorder}`,
                  borderRadius: '10px', padding: '6px', minWidth: '180px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100,
                }}>
                  {[
                    { label: 'Export as JSON', sub: 'All notes data', action: exportJSON, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                    { label: 'Export as CSV', sub: 'Spreadsheet format', action: exportCSV, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg> },
                    { label: 'Export as PDF', sub: 'Print-ready format', action: exportPDF, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> },
                  ].map(opt => (
                    <button key={opt.label} onClick={opt.action}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ color: textSecondary }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: textPrimary }}>{opt.label}</div>
                        <div style={{ fontSize: '11px', color: textSecondary }}>{opt.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New note */}
            <button onClick={() => navigate('/notes/new')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#0f1117', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#534AB7'}
              onMouseLeave={e => e.currentTarget.style.background = '#0f1117'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New note
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px 24px', borderBottom: `1px solid ${topbarBorder}`, background: topbarBg }}>
          {[
            { label: 'Total notes', value: notes.filter(n => !n.isTrashed && !n.isArchived).length, sub: `${notes.filter(n => { const d = new Date(n.createdAt); return (new Date() - d) < 7 * 24 * 60 * 60 * 1000 && !n.isTrashed; }).length} this week` },
            { label: 'Pinned', value: notes.filter(n => n.isPinned && !n.isTrashed).length, sub: `${notes.filter(n => n.isArchived).length} archived` },
            { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', sub: '' },
          ].map(stat => (
            <div key={stat.label} style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${cardBorder}` }}>
              <div style={{ fontSize: '11px', color: textSecondary, marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 600, color: textPrimary }}>{stat.value}</div>
              {stat.sub && <div style={{ fontSize: '11px', color: textSecondary, marginTop: '2px' }}>{stat.sub}</div>}
            </div>
          ))}
        </div>

        {/* Notes Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

          {filteredNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: textSecondary }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                {activeSection === 'trash' ? '🗑️' : activeSection === 'archived' ? '📦' : activeSection === 'pinned' ? '📌' : '📝'}
              </div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: textPrimary, marginBottom: '6px' }}>
                {search ? 'No notes found' : `No ${activeSection === 'all' ? '' : activeSection} notes`}
              </p>
              <p style={{ fontSize: '13px' }}>{search ? 'Try a different search term' : 'Nothing here yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {filteredNotes.map(note => (
                <div key={note._id} style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`, padding: '16px', position: 'relative' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = cardBorder}>

                  {note.isPinned && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#534AB7" stroke="#534AB7" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, margin: 0, paddingRight: note.isPinned ? '20px' : '0' }}>{note.title}</h3>
                    <span style={{ fontSize: '11px', color: textSecondary, whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatDate(note.createdAt)}</span>
                  </div>

                  <div style={{ fontSize: '12px', color: textSecondary, lineHeight: 1.6, marginBottom: '12px', height: '38px', overflow: 'hidden' }}
                    dangerouslySetInnerHTML={{ __html: note.content?.replace(/<[^>]*>/g, '').substring(0, 80) + '...' }} />

                  <div style={{ marginBottom: '10px' }}>
                    {(() => {
                      const cat = categories.find(c => c.id === note.category) || { label: 'General', color: '#9ca3af' };
                      return <span style={{ fontSize: '11px', padding: '3px 8px', background: cat.color + '20', color: cat.color, borderRadius: '20px', fontWeight: 500 }}>{cat.label}</span>;
                    })()}
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {activeSection === 'trash' ? (
                      <>
                        <button onClick={() => handleRestore(note._id)} style={{ padding: '5px 10px', background: 'transparent', border: `1px solid ${inputBorder}`, borderRadius: '6px', fontSize: '11px', color: '#16a34a', cursor: 'pointer' }}>Restore</button>
                        <button onClick={() => handleDelete(note._id)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '11px', color: '#dc2626', cursor: 'pointer' }}>Delete forever</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => navigate(`/notes/${note._id}`)} style={{ padding: '5px 10px', background: 'transparent', border: `1px solid ${inputBorder}`, borderRadius: '6px', fontSize: '11px', color: textPrimary, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handlePin(note._id)} style={{ padding: '5px 10px', background: note.isPinned ? 'rgba(83,74,183,0.1)' : 'transparent', border: `1px solid ${note.isPinned ? '#534AB7' : inputBorder}`, borderRadius: '6px', fontSize: '11px', color: note.isPinned ? '#534AB7' : textSecondary, cursor: 'pointer' }}>
                          {note.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button onClick={() => handleArchive(note._id)} style={{ padding: '5px 10px', background: 'transparent', border: `1px solid ${inputBorder}`, borderRadius: '6px', fontSize: '11px', color: textSecondary, cursor: 'pointer' }}>
                          {note.isArchived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button onClick={() => handleTrash(note._id)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '11px', color: '#dc2626', cursor: 'pointer' }}>Trash</button>
                      </>
                    )}
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

export default Dashboard;