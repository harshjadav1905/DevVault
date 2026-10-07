# ⚡ DevVault - Code Snippet Manager

DevVault is a full-stack MERN application designed for developers to store, categorize, search, and manage syntax-highlighted code snippets seamlessly.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), PrismJS (Syntax Highlighting), Lucide React (Icons), Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud Database)
- **ODM:** Mongoose

---

## ✨ Key Features

- **Full CRUD Support:** Add, view, copy, and delete code snippets in real-time.
- **Instant Search:** Client-side multi-parameter search filtering across titles, descriptions, and code blocks.
- **Language Filtering:** Category pills for JavaScript, Python, Bash, HTML, CSS, and SQL.
- **Syntax Highlighting:** Integrated code blocks using PrismJS themes.
- **Cloud Persistence:** Remote data persistence via MongoDB Atlas cluster.

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/snippets` | Fetch all saved code snippets |
| `POST` | `/api/snippets` | Create a new code snippet |
| `DELETE` | `/api/snippets/:id` | Delete a snippet by MongoDB ObjectId |

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string

### 2. Backend Setup
```bash
cd backend
npm install
node server.js

### 3. Frontend Setup
cd frontend
npm install
npm run dev