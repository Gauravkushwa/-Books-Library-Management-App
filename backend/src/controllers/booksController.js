const Book = require("../models/Book");

// GET /api/books – Fetch all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBooks };
