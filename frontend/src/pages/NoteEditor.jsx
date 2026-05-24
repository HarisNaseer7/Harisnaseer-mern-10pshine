import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { createNote, getNote, updateNote } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const categories = [
  { id: 'general', label: 'General', color: '#9ca3af' },
  { id: 'work', label: 'Work', color: '#378ADD' },
  { id: 'personal', label: 'Personal', color: '#639922' },
  { id: 'ideas', label: 'Ideas', color: '#534AB7' },
];

const NoteEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useTheme();

  const bg = isDark ? '#0f1117' : '#f9fafb';
  const cardBg = isDark ? '#1a1d27' : 'white';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const textPrimary = isDark ? 'white' : '#111827';
  const textSecondary = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const topbarBg = isDark ? '#13151f' : 'white';
  const topbarBorder = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';

  useEffect(() => { if (id) fetchNote(); }, [id]);

  const fetchNote = async () => {
    try {
      const res = await getNote(id);
      setTitle(res.data.data.title);
      setContent(res.data.data.content);
      setCategory(res.data.data.category || 'general');
    } catch {
      setError('Failed to fetch note');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Please enter a title');
    if (!content.trim() || content === '<p><br></p>') return setError('Please enter some content');
    setError('');
    setLoading(true);
    try {
      if (id) {
        await updateNote(id, { title, content, category });
      } else {
        await createNote({ title, content, category });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link'],
        ['clean'],
      ],
    },
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'color', 'background', 'link'];

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, fontFamily: 'system-ui' }}>

      {/* Sidebar */}
      <div style={{
        width: '220px', minWidth: '220px', background: '#0f1117',
        display: 'flex', flexDirection: 'column', padding: '20px 16px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'white', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px', color: '#0f1117',
          }}>N</div>
          <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>NoteApp</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 10px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer',
            marginBottom: '20px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to notes
        </button>

        {/* Category */}
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: '10px' }}>
          CATEGORY
        </div>
        {categories.map(cat => (
          <div key={cat.id} onClick={() => setCategory(cat.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
              color: category === cat.id ? 'white' : 'rgba(255,255,255,0.4)',
              fontSize: '13px', marginBottom: '3px',
              background: category === cat.id ? 'rgba(127,119,221,0.2)' : 'transparent',
              border: category === cat.id ? '1px solid rgba(127,119,221,0.3)' : '1px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
            {cat.label}
            {category === cat.id && (
              <svg style={{ marginLeft: 'auto' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7f77dd" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
        ))}

        {/* Word count */}
        <div style={{ marginTop: 'auto', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>STATS</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
            {content.replace(/<[^>]*>/g, '').length} characters
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', background: topbarBg, borderBottom: `1px solid ${topbarBorder}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '15px', fontWeight: 600, color: textPrimary, margin: 0 }}>
              {id ? 'Edit note' : 'New note'}
            </h1>
            {/* Category badge */}
            {(() => {
              const cat = categories.find(c => c.id === category);
              return (
                <span style={{
                  fontSize: '11px', padding: '2px 8px',
                  background: cat.color + '20', color: cat.color,
                  borderRadius: '20px', fontWeight: 500,
                }}>{cat.label}</span>
              );
            })()}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px', background: 'transparent',
                border: `1px solid ${topbarBorder}`, borderRadius: '8px',
                fontSize: '13px', color: textSecondary, cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Cancel</button>
            <button
              onClick={handleSubmit} disabled={loading}
              style={{
                padding: '8px 16px', background: '#0f1117',
                border: 'none', borderRadius: '8px',
                fontSize: '13px', color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#534AB7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f1117'; }}
            >
              {loading ? 'Saving...' : id ? 'Update note' : 'Save note'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {error && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <input
            type="text" placeholder="Note title..."
            value={title} onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px',
              border: `1px solid ${cardBorder}`, borderRadius: '10px',
              fontSize: '18px', fontWeight: 600, color: textPrimary,
              background: cardBg, outline: 'none', marginBottom: '16px',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = '#7f77dd'; e.target.style.boxShadow = '0 0 0 3px rgba(127,119,221,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = cardBorder; e.target.style.boxShadow = 'none'; }}
          />

          <div style={{ background: cardBg, borderRadius: '10px', border: `1px solid ${cardBorder}`, overflow: 'hidden' }}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your note here..."
              style={{ minHeight: '400px', color: textPrimary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;