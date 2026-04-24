import React, { useState } from "react";
import axios from "axios";

const EventCard = ({ event, refreshEvents }) => {
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://gcb-fest.onrender.com/api/reservations/register",
        // "http://localhost:8081/api/reservations/register",
        { eventId: event._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Registered Successfully!");
      setShowModal(false);
      refreshEvents(); // Call this to update the seat count on the main page
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="event-card"
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
    >
      <img src={event.image} alt={event.title} style={{ width: "100px" }} />
      <h3>{event.title}</h3>

      {/* Step: Instead of Register, show View Detail */}
      <button onClick={() => setShowModal(true)}>View Detail</button>

      {/* THE DIALOG / MODAL */}
      {showModal && (
        <div className="modal-overlay" style={modalStyles.overlay}>
          <div className="modal-content" style={modalStyles.content}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Date:</strong> {event.date} at {event.time}
            </p>

            {/* Display Remaining Seats */}
            <p style={{ color: event.remainingSeats > 0 ? "green" : "red" }}>
              Remaining Seats: {event.remainingSeats}
            </p>

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Close</button>

              {/* Only show button if seats available */}
              {event.remainingSeats > 0 ? (
                <button
                  onClick={handleRegister}
                  style={{
                    marginLeft: "10px",
                    background: "green",
                    color: "white",
                  }}
                >
                  Confirm Registration
                </button>
              ) : (
                <button disabled style={{ marginLeft: "10px" }}>
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple inline styles for the modal
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
  },
};

export default EventCard;
