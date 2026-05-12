const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get all tasks (optionally filter by project)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.query.project ? { project: req.query.project } : {};
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my tasks
router.get('/my', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    const task = await Task.create({
      title, description, project, assignedTo,
      priority, dueDate, createdBy: req.user._id
    });
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return res.status(403).json({ message: 'Only Admins can delete tasks' });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
