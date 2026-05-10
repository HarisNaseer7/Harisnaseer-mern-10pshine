import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setNotes(notes.map((n) => n.id === editId ? { ...n, title, content } : n));
      setEditId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content }]);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h2>Guest Mode</h2>
        <div>
          <span style={{ color: '#e74c3c', marginRight: '15px' }}>
            ⚠️ Notes will not be saved!
          </span>
          <button onClick={() => navigate('/register')} className='logout-btn'>
            Sign Up to Save
          </button>
        </div>
      </div>

      <div className='note-form'>
        <h3>{editId ? 'Edit Note' : 'Create Note'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder='Content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type='submit'>
            {editId ? 'Update Note' : 'Create Note'}
          </button>
          {editId && (
            <button type='button' onClick={() => { setEditId(null); setTitle(''); setContent(''); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className='notes-list'>
        <h3>My Notes ({notes.length})</h3>
        {notes.length === 0 ? (
          <p>No notes yet. Create your first note!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className='note-card'>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <div className='note-actions'>
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;