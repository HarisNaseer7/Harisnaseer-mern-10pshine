const express = require('express');
const router = express.Router();
const {
  createNote, getNotes, getNote,
  updateNote, deleteNote,
  pinNote, archiveNote, trashNote, restoreNote
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

router.patch('/:id/pin', pinNote);
router.patch('/:id/archive', archiveNote);
router.patch('/:id/trash', trashNote);
router.patch('/:id/restore', restoreNote);

module.exports = router;