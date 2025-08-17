import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://books-library-management-app-2.onrender.com/api/books", { withCredentials: true })
      .then((res) => setBooks(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (bookId) => {
    alert(`Book ID ${bookId} added to your list`);
  };

  if (loading) return <p className="loading-text">Loading books...</p>;

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>
        Books Library
      </h1>
      <div className="grid-container">
        {books.map((book) => (
          <BookCard key={book._id} book={book} handleAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
};

export default Home;
