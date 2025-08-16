import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig"; // Use a centralized Axios instance
import MyBookCard from "../components/MyBookCard";

import "../styles/BookCard.css";

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's books
  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await api.get("/mybooks");
        setMyBooks(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to fetch your books. Please login or try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBooks();
  }, []);

  // Update reading status
  const updateStatus = async (bookId, status) => {
    try {
      const res = await api.patch(`/mybooks/${bookId}/status`, { status });
      setMyBooks((prev) =>
        prev.map((b) => (b.bookId._id === bookId ? res.data : b))
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Update rating
  const updateRating = async (bookId, rating) => {
    try {
      const res = await api.patch(`/mybooks/${bookId}/rating`, { rating });
      setMyBooks((prev) =>
        prev.map((b) => (b.bookId._id === bookId ? res.data : b))
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <p className="loading-text">Loading your books...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!myBooks.length) return <p>No books in your list yet.</p>;

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>
        My Books
      </h1>
      <div className="grid-container">
        {myBooks.map((item) => (
          <div key={item.bookId._id} className="book-card">
            <img
              src={item.bookId.coverImage}
              alt={item.bookId.title}
              className="book-card-img"
            />
            <div className="book-card-body">
              <h2>{item.bookId.title}</h2>
              <p>{item.bookId.author}</p>

              <div className="book-card-control">
                <label>Status:</label>
                <select
                  value={item.status}
                  onChange={(e) =>
                    updateStatus(item.bookId._id, e.target.value)
                  }
                >
                  <option>Want to Read</option>
                  <option>Reading</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="book-card-control">
                <label>Rating:</label>
                <select
                  value={item.rating || 0}
                  onChange={(e) =>
                    updateRating(item.bookId._id, Number(e.target.value))
                  }
                >
                  <option value={0}>0</option>
                  <option value={1}>1⭐</option>
                  <option value={2}>2⭐</option>
                  <option value={3}>3⭐</option>
                  <option value={4}>4⭐</option>
                  <option value={5}>5⭐</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooks;
