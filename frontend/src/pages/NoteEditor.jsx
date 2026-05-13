import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { createNote, getNote, updateNote } from '../services/api';

const NoteEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await getNote(id);
      setTitle(res.data.data.title);
      setContent(res.data.data.content);
    } catch (err) {
      setError('Failed to fetch note');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        await updateNote(id, { title, content });
      } else {
        await createNote({ title, content });
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

   const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list',
  'color', 'background',
  'link',
];

  return (
    <div className='note-editor'>
      <div className='note-editor-header'>
        <h2>{id ? 'Edit Note' : 'Create Note'}</h2>
        <button onClick={() => navigate('/dashboard')} className='cancel-btn'>
          Cancel
        </button>
      </div>

      {error && <p className='error'>{error}</p>}

      <form onSubmit={handleSubmit} className='note-editor-form'>
        <input
          type='text'
          placeholder='Note Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='note-title-input'
          required
        />

        <ReactQuill
  theme='snow'
  value={content}
  onChange={setContent}
  modules={modules}
  formats={formats}
  placeholder='Write your note here...'
  className='quill-editor'
/>

        <button type='submit' disabled={loading} className='save-btn'>
          {loading ? 'Saving...' : id ? 'Update Note' : 'Save Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteEditor;