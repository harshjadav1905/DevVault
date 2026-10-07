import React, { useState, useEffect } from 'react';
import './App.css';
import { Code, Trash2, Copy, Check, Terminal, Search, Tag } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

const API_BASE = 'https://devvault-qrly.onrender.com/api/snippets';

const LANGUAGES = ['All', 'JavaScript', 'Python', 'Bash', 'HTML', 'CSS', 'SQL'];

function App() {
  const [snippets, setSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    language: 'JavaScript',
    description: '',
    code: ''
  });

  const fetchSnippets = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setSnippets(data);
    } catch (err) {
      console.error('Error fetching snippets:', err);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [snippets, searchQuery, selectedLanguage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code) return;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', language: 'JavaScript', description: '', code: '' });
        fetchSnippets();
      }
    } catch (err) {
      console.error('Error saving snippet:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSnippets(snippets.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Error deleting snippet:', err);
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === 'All' || item.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLanguage;
  });

  const getPrismLangClass = (lang) => {
    const map = {
      javascript: 'language-javascript',
      python: 'language-python',
      bash: 'language-bash',
      html: 'language-markup',
      css: 'language-css',
      sql: 'language-sql'
    };
    return map[lang.toLowerCase()] || 'language-javascript';
  };

  return (
    <div className="container">
      <header>
        <h1><Code size={36} /> DevVault</h1>
        <p>Production Code Snippet Manager for Developers</p>
      </header>

      <div className="stats-bar">
        <span className="stat-chip">Total Snippets: <strong>{snippets.length}</strong></span>
        <span className="stat-chip">Filtered: <strong>{filteredSnippets.length}</strong></span>
      </div>

      <form className="snippet-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Express MongoDB Connection Setup"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Language</label>
            <select name="language" value={formData.language} onChange={handleChange}>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Bash">Bash</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="SQL">SQL</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <input
            type="text"
            name="description"
            placeholder="Brief description of what this does..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Code Snippet</label>
          <textarea
            className="code-area"
            rows="5"
            name="code"
            placeholder="Paste raw code snippet here..."
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          <Terminal size={18} /> Save Snippet
        </button>
      </form>

      <div className="controls-section">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search snippets by title, description or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              className={`pill-btn ${selectedLanguage === lang ? 'active' : ''}`}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="empty-state">No matching snippets found.</div>
      ) : (
        <div className="grid">
          {filteredSnippets.map((snip) => (
            <div key={snip._id} className="card">
              <div>
                <div className="card-header">
                  <h3>{snip.title}</h3>
                  <span className="badge">{snip.language}</span>
                </div>
                {snip.description && <p className="card-desc">{snip.description}</p>}
                
                <div className="code-container">
                  <pre>
                    <code className={getPrismLangClass(snip.language)}>
                      {snip.code}
                    </code>
                  </pre>
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="action-btn"
                  onClick={() => copyToClipboard(snip._id, snip.code)}
                >
                  {copiedId === snip._id ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                  {copiedId === snip._id ? 'Copied!' : 'Copy'}
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(snip._id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;