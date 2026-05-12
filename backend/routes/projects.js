const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get all projects for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create project (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return res.status(403).json({ message: 'Only Admins can create projects' });
    const { name, description } = req.body;
    const project = await Project.create({ name, description, owner: req.user._id, members: [req.user._id] });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update project (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin')
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add member to project
router.post('/:id/members', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (req.user.role !== 'Admin')
      return res.status(403).json({ message: 'Only Admins can add members' });
    if (!project.members.includes(req.body.userId)) {
      project.members.push(req.body.userId);
      await project.save();
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete project (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return res.status(403).json({ message: 'Only Admins can delete projects' });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
