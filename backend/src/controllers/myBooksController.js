const MyBook = require("../models/MyBook");
const Book = require("../models/Book");

// GET /api/mybooks – Fetch user’s books
const getMyBooks = async (req, res) => {
  try {
    const myBooks = await MyBook.find({ userId: req.user._id }).populate("bookId");
    res.json(myBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/mybooks/:bookId – Add book to user's list
const addMyBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const bookExists = await Book.findById(bookId);
    if (!bookExists) return res.status(404).json({ message: "Book not found" });

    const alreadyAdded = await MyBook.findOne({ userId: req.user._id, bookId });
    if (alreadyAdded) return res.status(400).json({ message: "Book already in your list" });

    const myBook = await MyBook.create({
      userId: req.user._id,
      bookId,
      status: "Want to Read"
    });

    res.status(201).json(myBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/mybooks/:bookId/status – Update reading status
const updateStatus = async (req, res) => {
  const { bookId } = req.params;
  const { status } = req.body;

  try {
    const myBook = await MyBook.findOne({ userId: req.user._id, bookId });
    if (!myBook) return res.status(404).json({ message: "Book not found in your list" });

    myBook.status = status;
    await myBook.save();

    res.json(myBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/mybooks/:bookId/rating – Update rating
const updateRating = async (req, res) => {
  const { bookId } = req.params;
  const { rating } = req.body;

  try {
    const myBook = await MyBook.findOne({ userId: req.user._id, bookId });
    if (!myBook) return res.status(404).json({ message: "Book not found in your list" });

    myBook.rating = rating;
    await myBook.save();

    res.json(myBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyBooks, addMyBook, updateStatus, updateRating };
