import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote, pinNote, archiveNote, trashNote, restoreNote, createNote } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar, { categories, MenuIcon } from '../components/Sidebar';
import { getThemeColors } from '../utils/theme';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [activeCategory, setActiveCategory] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const importRef = useRef();
  const exportMenuRef = useRef();

  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const {
    bg, cardBg, cardBorder, textPrimary, textSecondary,
    topbarBg, topbarBorder, inputBorder, menuBg,
  } = getThemeColors(isDark);

  useEffect(() => { fetchNotes(); }, []);

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

  const exportJSON = () => {
    const exportData = notes
      .filter(n => !n.isTrashed)
      .map(n => ({
        title: n.title, content: n.content, category: n.category,
        isPinned: n.isPinned, isArchived: n.isArchived,
        createdAt: n.createdAt, updatedAt: n.updatedAt,
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
    win.onload = () => { win.print(); URL.revokeObjectURL(url); };
    setShowExportMenu(false);
  };

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
          await createNote({ title: note.title, content: note.content, category: note.category || 'general' });
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

      <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />

      <Sidebar
        mode="dashboard"
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        notes={notes}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px', padding: '16px 24px', background: topbarBg, borderBottom: `1px solid ${topbarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="sidebar-toggle-btn" onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu" style={{ color: textPrimary }}>
              <MenuIcon />
            </button>
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: textPrimary, margin: 0 }}>
              {activeCategory ? categories.find(c => c.id === activeCategory)?.label : sectionTitles[activeSection]}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {importStatus && (
              <span style={{
                fontSize: '12px', padding: '6px 12px', borderRadius: '8px',
                background: importStatus.startsWith('✓') ? '#f0fdf4' : '#fef2f2',
                color: importStatus.startsWith('✓') ? '#16a34a' : '#dc2626',
              }}>{importStatus}</span>
            )}

            <button onClick={() => importRef.current.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'transparent', color: textPrimary, border: `1px solid ${inputBorder}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import
            </button>

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

                  <p style={{ fontSize: '12px', color: textSecondary, lineHeight: 1.6, marginBottom: '12px', height: '38px', overflow: 'hidden', margin: '0 0 12px 0' }}>
                    {note.content?.replace(/<[^>]*>/g, '').substring(0, 80)}...
                  </p>

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