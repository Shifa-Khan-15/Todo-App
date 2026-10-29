require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

app.use(session({
  name: 'todo.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

// User database
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Todo database
const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  subtasks: { type: [String], default: [] }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Authentication protection
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please log in first.' });
  }
  next();
}

// Current login status
app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }

  res.json({
    user: {
      id: req.session.userId,
      email: req.session.email
    }
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long.'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please log in.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    req.session.userId = user._id.toString();
    req.session.email = user.email;

    req.session.save(err => {
      if (err) return res.status(500).json({ error: 'Could not start your session.' });
      res.status(201).json({
        user: { id: user._id, email: user.email }
      });
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Could not create your account.' });
  }
});

// Log in
app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    req.session.regenerate(err => {
      if (err) return res.status(500).json({ error: 'Could not start your session.' });

      req.session.userId = user._id.toString();
      req.session.email = user.email;

      req.session.save(saveErr => {
        if (saveErr) return res.status(500).json({ error: 'Could not start your session.' });
        res.json({ user: { id: user._id, email: user.email } });
      });
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Could not log in.' });
  }
});

// Log out
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Could not log out.' });
    res.clearCookie('todo.sid', { httpOnly: true, sameSite: 'lax' });
    res.json({ success: true });
  });
});

// Get only this user's tasks
app.get('/api/todos', requireAuth, async (req, res) => {
  try {
    const list = await Todo.find({ userId: req.session.userId }).sort({ _id: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not load tasks.' });
  }
});

// Add a task for this user
app.post('/api/todos', requireAuth, async (req, res) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title) return res.status(400).json({ error: 'Task title is required.' });

    const newTodo = await Todo.create({
      userId: req.session.userId,
      title
    });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Could not add task.' });
  }
});

// Edit only this user's task
app.put('/api/todos/:id', requireAuth, async (req, res) => {
  try {
    const changes = {};

    if (typeof req.body.title === 'string' && req.body.title.trim()) {
      changes.title = req.body.title.trim();
    }
    if (typeof req.body.completed === 'boolean') {
      changes.completed = req.body.completed;
    }
    if (Array.isArray(req.body.subtasks) &&
        req.body.subtasks.every(item => typeof item === 'string')) {
      changes.subtasks = req.body.subtasks;
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { $set: changes },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Task not found.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Could not update task.' });
  }
});

// Delete only this user's task
app.delete('/api/todos/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!deleted) return res.status(404).json({ error: 'Task not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Could not delete task.' });
  }
});

// Gemini AI Task Breakdown (login required)
app.post('/api/ai/breakdown', requireAuth, async (req, res) => {
  try {
    const task = req.body.task;

    if (typeof task !== 'string' || !task.trim()) {
      return res.status(400).json({ error: 'Please enter a task to break down.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is missing from .env' });
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          store: false,
          input: `Break this task into exactly 3 short, actionable subtasks.
Return only a JSON array of 3 strings.
Task: ${task.trim()}`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API status:', response.status);
      console.error('Gemini API response:', JSON.stringify(data.error || data));
      return res.status(502).json({
        error: 'Gemini API error (HTTP ' + response.status + '). Check CMD.'
      });
    }

    const output = data.output_text ||
      (data.steps || [])
        .filter(step => step.type === 'model_output')
        .flatMap(step => step.content || [])
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

    if (typeof output !== 'string' || !output.trim()) {
      return res.status(502).json({ error: 'Gemini returned no text. Check CMD.' });
    }

    const cleaned = output
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const subtasks = JSON.parse(cleaned);

    if (!Array.isArray(subtasks) ||
        !subtasks.every(item => typeof item === 'string' && item.trim())) {
      return res.status(502).json({ error: 'AI returned an invalid task list.' });
    }

    res.json({ subtasks: subtasks.slice(0, 6) });
  } catch (err) {
    console.error('AI breakdown error:', err.message);
    res.status(500).json({ error: 'Something went wrong with AI Task Breakdown.' });
  }
});

if (!process.env.SESSION_SECRET) {
  console.error('Missing SESSION_SECRET in .env');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));