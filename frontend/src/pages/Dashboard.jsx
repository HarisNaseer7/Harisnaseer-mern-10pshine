import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data.data);
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editId) {
        await updateNote(editId, { title, content });
      } else {
        await createNote({ title, content });
      }
      setTitle('');
      setContent('');
      setEditId(null);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h2>Welcome, {user?.name}!</h2>
        <button onClick={handleLogout} className='logout-btn'>Logout</button>
      </div>

      {error && <p className='error'>{error}</p>}

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
          <button type='submit' disabled={loading}>
            {loading ? 'Saving...' : editId ? 'Update Note' : 'Create Note'}
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
            <div key={note._id} className='note-card'>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <div className='note-actions'>
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;