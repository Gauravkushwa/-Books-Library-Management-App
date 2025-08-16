const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");
const Book = require("../models/Book");
const MyBook = require("../models/MyBook");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
console.log("Mongo URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    const users = await User.find({});
    const books = await Book.find({});

    if (users.length === 0 || books.length === 0) {
      console.log("❌ No users or books found. Seed users and books first!");
      process.exit();
    }

    let mybooksCount = 0;

    for (const user of users) {
      // Randomly assign 5 books per user
      const shuffledBooks = books.sort(() => 0.5 - Math.random());
      const selectedBooks = shuffledBooks.slice(0, 5);

      for (const book of selectedBooks) {
        const exists = await MyBook.findOne({ userId: user._id, bookId: book._id });
        if (!exists) {
          await MyBook.create({
            userId: user._id,
            bookId: book._id,
            status: "Want to Read",
            rating: 1
          });
          mybooksCount++;
        }
      }
    }

    console.log(`📗 Created ${mybooksCount} mybooks entries`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Seeding error:", err);
    mongoose.disconnect();
  });
