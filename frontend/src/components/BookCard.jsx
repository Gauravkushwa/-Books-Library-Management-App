import React from "react";
import "../styles/BookCard.css";

const BookCard = ({ book, handleAdd }) => {
  return (
    <div className="book-card">
      <img src={book.coverImage} alt={book.title} />
      <div className="book-card-body">
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <p className={book.availability ? "available" : "not-available"}>
          {book.availability ? "Available" : "Not Available"}
        </p>
        <button onClick={() => handleAdd(book._id)}>Want to Read</button>
      </div>
    </div>
  );
};

export default BookCard;
