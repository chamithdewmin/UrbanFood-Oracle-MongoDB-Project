import React, { useState, useEffect } from "react";
import "./Feedback.css";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feedback");
      if (response.ok) {
        const data = await response.json();
        setFeedbackList(data);
      } else {
        console.error("Failed to fetch feedbacks");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = { name, message };

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        console.log("Feedback submitted successfully");
        setStatusMessage("✅ Thank you! Your feedback was submitted.");
        setIsError(false);
        setName("");
        setMessage("");
        fetchFeedbacks();
      } else {
        console.error("Failed to submit feedback");
        setStatusMessage("❌ Failed to submit feedback. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("❌ An error occurred. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="feedback-form" id="feedback-form">
      <p>We value your feedback! Please share your thoughts.</p>

      {statusMessage && (
        <div
          style={{
            color: isError ? "red" : "green",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form-content">
        <div className="feedback-input">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="feedback-input">
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your feedback"
            required
          />
        </div>

        <button type="submit" className="feedback-submit">
          Submit Feedback
        </button>
      </form>

      {/* Display Feedback Cards */}
      <div className="feedback-cards">
        {feedbackList.length > 0 ? (
          feedbackList.map((fb, index) => (
            <div key={index} className="feedback-card">
              <div className="profile-pic">👤</div>
              <div className="quote">“</div>
              <h3 className="feedback-name">{fb.name}</h3>
              <p className="feedback-message">{fb.message}</p>
              <div className="stars">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          ))
        ) : (
          <p>No feedback yet.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
