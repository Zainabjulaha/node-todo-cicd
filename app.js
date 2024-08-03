// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('sanitizer');

// Create an Express app instance
const app = express();

// Set port number
const port = 8000;

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Initialize todo list
let todolist = [];

// Route handlers

/**
 * Display todo list and form
 */
app.get('/todo', (req, res) => {
  res.render('todo.ejs', {
    todolist,
    clickHandler: "func1();"
  });
});

/**
 * Add item to todo list
 */
app.post('/todo/add/', (req, res) => {
  const newTodo = sanitizer.escape(req.body.newtodo);
  if (newTodo !== '') {
    todolist.push(newTodo);
  }
  res.redirect('/todo');
});

/**
 * Delete item from todo list
 */
app.get('/todo/delete/:id', (req, res) => {
  if (req.params.id !== '') {
    todolist.splice(req.params.id, 1);
  }
  res.redirect('/todo');
});

/**
 * Get single todo item and render edit page
 */
app.get('/todo/:id', (req, res) => {
  const todoIdx = req.params.id;
  const todo = todolist[todoIdx];

  if (todo) {
    res.render('edititem.ejs', {
      todoIdx,
      todo,
      clickHandler: "func1();"
    });
  } else {
    res.redirect('/todo');
  }
});

/**
 * Edit item in todo list
 */
app.put('/todo/edit/:id', (req, res) => {
  const todoIdx = req.params.id;
  const editTodo = sanitizer.escape(req.body.editTodo);
  if (todoIdx !== '' && editTodo !== '') {
    todolist[todoIdx] = editTodo;
  }
  res.redirect('/todo');
});

/**
 * Redirect to todo list if page not found
 */
app.use((req, res, next) => {
  res.redirect('/todo');
});

// Start server
app.listen(port, () => {
  console.log(`Todolist running on http://0.0.0.0:${port}`);
});

// Export app
module.exports = app;
