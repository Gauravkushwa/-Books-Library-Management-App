// CommonJS seeder: users, books (with images), and mybooks
require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("../models/User");
const Book = require("../models/Book");
const MyBook = require("../models/MyBook");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ---- CONFIG ----
const NUM_BOOKS = 350;          // how many books to generate
const USERS = [
  { email: "admin@example.com", password: "Admin@123" },
  { email: "alice@example.com", password: "Password@123" },
  { email: "bob@example.com",   password: "Password@123" }
];
const STATUSES = ["Want to Read", "Currently Reading", "Read"];

// Helper: random hex like "FF5733"
const randomHex = () => Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

// Helper: generate a nice placeholder cover based on title
const coverFor = (title) => {
  const bg = randomHex().toUpperCase();
  // readable foreground (white)
  const fg = "FFFFFF";
  const text = encodeURIComponent(title);
  // 300x450 portrait placeholder with book title
  return `https://placehold.co/300x450/${bg}/${fg}?text=${text}`;
};

async function connectDB() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");
}

async function clearCollections() {
  await Promise.all([
    MyBook.deleteMany({}),
    Book.deleteMany({}),
    User.deleteMany({})
  ]);
  console.log("🧹 Cleared users, books, mybooks");
}

function makeBooks(n) {
  const books = [];
  for (let i = 0; i < n; i++) {
    const title = faker.lorem.words({ min: 2, max: 5 });
    const author = faker.person.fullName();
    books.push({
      title,
      author,
      coverImage: coverFor(title),
      availability: faker.datatype.boolean()
    });
  }
  return books;
}

async function createUsers() {
  const created = [];
  for (const u of USERS) {
    // Using pre-save hook to hash password:
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      created.push(existing);
    } else {
      const doc = await User.create(u);
      created.push(doc);
    }
  }
  console.log(`👤 Users ensured: ${created.map(u => u.email).join(", ")}`);
  return created;
}

async function createBooks() {
  const docs = await Book.insertMany(makeBooks(NUM_BOOKS));
  console.log(`📚 Inserted ${docs.length} books`);
  return docs;
}

function pickRandom(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

async function createMyBooks(users, books) {
  // For each user, attach 15–25 random books with random status/rating
  const ops = [];
  for (const user of users) {
    const sample = pickRandom(books, faker.number.int({ min: 15, max: 25 }));
    for (const b of sample) {
      const status = faker.helpers.arrayElement(STATUSES);
      const rating = status === "Read" ? faker.number.int({ min: 1, max: 5 }) : undefined;
      ops.push({
        userId: user._id,
        bookId: b._id,
        status,
        rating
      });
    }
  }
  if (ops.length) {
    await MyBook.insertMany(ops, { ordered: false }).catch(() => {}); // ignore dup errors
  }
  console.log(`📗 Created ${ops.length} mybooks rows (combined for all users)`);
}

async function run({ fresh }) {
  await connectDB();
  if (fresh) await clearCollections();

  const users = await createUsers();
  const books = await createBooks();
  await createMyBooks(users, books);

  const counts = {
    users: await User.countDocuments(),
    books: await Book.countDocuments(),
    mybooks: await MyBook.countDocuments()
  };
  console.log("✅ Done seeding:", counts);

  await mongoose.disconnect();
  console.log("🔌 Disconnected");
}

// CLI flag: --fresh (drop & reseed)
const fresh = process.argv.includes("--fresh");
run({ fresh }).catch(err => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
