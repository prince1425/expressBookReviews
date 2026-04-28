const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router();


// =========================
// 🔹 ASYNC/AWAIT ROUTES
// =========================

// Get all books (async)
public_users.get('/asyncbooks', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get by ISBN (async)
public_users.get('/asyncisbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching ISBN" });
  }
});

// Get by author (async)
public_users.get('/asyncauthor/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching author" });
  }
});

// Get by title (async)
public_users.get('/asynctitle/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching title" });
  }
});


// =========================
// 🔹 PROMISE ROUTES
// =========================

// ISBN (promise)
public_users.get('/promiseisbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Error fetching ISBN" }));
});

// Author (promise)
public_users.get('/promiseauthor/:author', (req, res) => {
  const author = req.params.author;

  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Error fetching author" }));
});

// Title (promise)
public_users.get('/promisetitle/:title', (req, res) => {
  const title = req.params.title;

  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => res.status(200).json(response.data))
    .catch(() => res.status(500).json({ message: "Error fetching title" }));
});


// =========================
// 🔹 ORIGINAL ROUTES
// =========================

// Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

// Get by author
public_users.get('/author/:author', (req, res) => {
  const filtered = Object.values(books).filter(
    book => book.author === req.params.author
  );
  return res.status(200).json(filtered);
});

// Get by title
public_users.get('/title/:title', (req, res) => {
  const filtered = Object.values(books).filter(
    book => book.title === req.params.title
  );
  return res.status(200).json(filtered);
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  return res.status(200).json(books[req.params.isbn].reviews);
});


module.exports.general = public_users;
