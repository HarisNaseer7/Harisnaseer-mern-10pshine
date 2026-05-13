import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
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

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h2>Welcome, {user?.name}!</h2>
      </div>
      {error && <p className='error'>{error}</p>}
      <button onClick={() => navigate('/notes/new')} className='create-note-btn'>
        + Create New Note
      </button>
      <div className='notes-list'>
        <h3>My Notes ({notes.length})</h3>
        {notes.length === 0 ? (
          <p>No notes yet. Create your first note!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className='note-card'>
              <h4>{note.title}</h4>
              <div
                className='note-preview'
                dangerouslySetInnerHTML={{
                  __html: note.content.length > 100
                    ? note.content.substring(0, 100) + '...'
                    : note.content
                }}
              />
              <div className='note-actions'>
                <button onClick={() => navigate(`/notes/${note._id}`)}>Edit</button>
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
