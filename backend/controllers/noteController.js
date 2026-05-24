const Note = require('../models/Note');
const logger = require('../utils/logger');

const createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content)
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    const note = await Note.create({ title, content, category: category || 'general', user: req.user.id });
    logger.info(`Note created by user: ${req.user.email}`);
    res.status(201).json({ success: true, message: 'Note created successfully', data: note });
  } catch (error) { next(error); }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) { next(error); }
};

const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.status(200).json({ success: true, data: note });
  } catch (error) { next(error); }
};

const updateNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true }
    );
    logger.info(`Note updated by user: ${req.user.email}`);
    res.status(200).json({ success: true, message: 'Note updated successfully', data: note });
  } catch (error) { next(error); }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await note.deleteOne();
    logger.info(`Note deleted by user: ${req.user.email}`);
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) { next(error); }
};

const pinNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    note.isPinned = !note.isPinned;
    await note.save();
    res.status(200).json({ success: true, message: `Note ${note.isPinned ? 'pinned' : 'unpinned'}`, data: note });
  } catch (error) { next(error); }
};

const archiveNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    note.isArchived = !note.isArchived;
    if (note.isArchived) note.isTrashed = false;
    await note.save();
    res.status(200).json({ success: true, message: `Note ${note.isArchived ? 'archived' : 'unarchived'}`, data: note });
  } catch (error) { next(error); }
};

const trashNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    note.isTrashed = true;
    note.isArchived = false;
    note.isPinned = false;
    await note.save();
    res.status(200).json({ success: true, message: 'Note moved to trash', data: note });
  } catch (error) { next(error); }
};

const restoreNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    note.isTrashed = false;
    await note.save();
    res.status(200).json({ success: true, message: 'Note restored', data: note });
  } catch (error) { next(error); }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote, pinNote, archiveNote, trashNote, restoreNote };