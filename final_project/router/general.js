const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router();


// =========================
// 🔹 REGISTER USER
// =========================
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


// =========================
// 🔹 GET ALL BOOKS (ASYNC)
// =========================
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// =========================
// 🔹 GET BOOK BY ISBN (ASYNC)
// =========================
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching ISBN" });
  }
});


// =========================
// 🔹 GET BOOK BY AUTHOR (ASYNC)
// =========================
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching author" });
  }
});


// =========================
// 🔹 GET BOOK BY TITLE (ASYNC)
// =========================
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching title" });
  }
});


// =========================
// 🔹 GET BOOK REVIEWS
// =========================
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});


module.exports.general = public_users;
