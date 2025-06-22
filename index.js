const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const promClient = require('prom-client');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5] // Buckets for response time from 0.1s to 5s
});

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.url,
      status_code: res.statusCode
    });
  });
  next();
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

let todos = [];
let nextId = 1; // Change from const to let to allow reassignment during tests

const resetState = () => {
  todos.length = 0; // Clear the todos array
  nextId = 1; // Reset the ID counter
};

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Create a new todo
app.post('/todos', (req, res) => {
  const { title, completed = false } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const todo = { id: nextId++, title, completed };
  todos.push(todo);
  res.status(201).json(todo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(index, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TODO backend running at http://localhost:${PORT}`);
  });
}

module.exports = { app, todos, resetState };
