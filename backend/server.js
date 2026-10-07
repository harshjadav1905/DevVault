const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Snippet = require('./models/Snippet');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devvault';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- REST API ENDPOINTS (CRUD) ---

// 1. GET: Fetch all snippets
app.get('/api/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST: Create a new snippet
app.post('/api/snippets', async (req, res) => {
  try {
    const { title, language, code, description } = req.body;
    const newSnippet = new Snippet({ title, language, code, description });
    const savedSnippet = await newSnippet.save();
    res.status(201).json(savedSnippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. PUT: Update snippet
app.put('/api/snippets/:id', async (req, res) => {
  try {
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSnippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json(updatedSnippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. DELETE: Remove snippet
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    const deletedSnippet = await Snippet.findByIdAndDelete(req.params.id);
    if (!deletedSnippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});