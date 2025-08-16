import React, { useState } from "react";
import axios from "axios";

const MyBookCard = ({ myBook, fetchMyBooks }) => {
  const { _id, bookId, status, rating } = myBook;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentRating, setCurrentRating] = useState(rating || 0);
  const [loading, setLoading] = useState(false);

  // Update reading status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:8282/api/mybooks/${bookId._id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setLoading(false);
    } catch (error) {
      console.error("Status update failed", error);
      setLoading(false);
    }
  };

  // Update rating
  const handleRatingChange = async (newRating) => {
    setCurrentRating(newRating);
    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:8282/api/mybooks/${bookId._id}/rating`,
        { rating: newRating },
        { withCredentials: true }
      );
      setLoading(false);
    } catch (error) {
      console.error("Rating update failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="card w-64 bg-base-100 shadow-xl m-4 hover:scale-105 transform transition duration-300">
      <figure>
        <img src={bookId.coverImage} alt={bookId.title} className="h-64 w-full object-cover"/>
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">{bookId.title}</h2>
        <p className="text-sm text-gray-600">{bookId.author}</p>

        {/* Status Dropdown */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Status:</label>
          <select
            value={currentStatus}
            onChange={handleStatusChange}
            className="select select-bordered w-full"
          >
            <option>Want to Read</option>
            <option>Currently Reading</option>
            <option>Read</option>
          </select>
        </div>

        {/* Rating */}
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Rating:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`btn btn-xs btn-ghost ${currentRating >= star ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-xs text-gray-500 mt-2">Updating...</p>}
      </div>
    </div>
  );
};

export default MyBookCard;
