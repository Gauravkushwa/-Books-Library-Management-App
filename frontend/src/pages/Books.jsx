// src/pages/Books.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import BookCard from "../components/BookCard";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleAdd = async (bookId) => {
    try {
      await api.post(`/mybooks/${bookId}`);
      alert("Book added to My Books!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", padding: "20px" }}>
      {books.map((book) => (
        <BookCard key={book._id} book={book} handleAdd={handleAdd} />
      ))}
    </div>
  );
};

export default Books;
