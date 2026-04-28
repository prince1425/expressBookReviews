const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// ✅ Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};


// ✅ Check login credentials
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {

  const { username, password } = req.body;

  // ❌ Missing fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // ❌ Invalid user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Generate JWT
  const accessToken = jwt.sign(
    { username: username },
    "access",
    { expiresIn: "1h" }
  );

  // ✅ Store token in session
  req.session.authorization = {
    accessToken: accessToken
  };

  return res.status(200).json({
    message: "User logged in successfully",
    token: accessToken
  });
});

// ✅ Add or Modify Review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review; // from query
  const username = req.user.username; // from JWT/session

  // Add or modify review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully",
    book: books[isbn]
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.user.username; // from session/JWT

  if (books[isbn] && books[isbn].reviews[username]) {

    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully",
      book: books[isbn]
    });
  }

  return res.status(404).json({
    message: "Review not found for this user"
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;