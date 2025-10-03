const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const allTasks = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    res.json(task.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

//Create a task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, due_date, category } = req.body;
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, due_date, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, due_date || null, category || 'General']
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// // Create a task
// app.post('/api/tasks', async (req, res) => {
//   try {
//     const { title, description, due_date } = req.body;
//     const newTask = await pool.query(
//       'INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
//       [title, description, due_date || null]
//     );
//     res.json(newTask.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

//Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, due_date, category } = req.body;
    const updateTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3, due_date = $4, category = $5 WHERE id = $6 RETURNING *',
      [title, description, completed, due_date, category, id]
    );
    res.json(updateTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// // Update a task
// app.put('/api/tasks/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, completed, due_date } = req.body;
//     const updateTask = await pool.query(
//       'UPDATE tasks SET title = $1, description = $2, completed = $3, due_date = $4 WHERE id = $5 RETURNING *',
//       [title, description, completed, due_date, id]
//     );
//     res.json(updateTask.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});