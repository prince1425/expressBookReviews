const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router(); // ✅ MOVE THIS UP


// ✅ Async/Await Axios route
public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});
public_users.get('/asyncisbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
  
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
  });
  public_users.get('/asyncauthor/:author', async function (req, res) {
    try {
      const author = req.params.author;
  
      const response = await axios.get(`http://localhost:5000/author/${author}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });
  public_users.get('/asynctitle/:title', async function (req, res) {
    try {
      const title = req.params.title;
  
      const response = await axios.get(`http://localhost:5000/title/${title}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
  });

// ✅ Register
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


// ✅ Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


// ✅ Get by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) return res.status(200).json(book);

  return res.status(404).json({ message: "Book not found" });
});


// ✅ Get by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const filteredBooks = Object.values(books).filter(
    (book) => book.author === author
  );

  return res.status(200).json(filteredBooks);
});


// ✅ Get by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const filteredBooks = Object.values(books).filter(
    (book) => book.title === title
  );

  return res.status(200).json(filteredBooks);
});


// ✅ Get reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});


module.exports.general = public_users;