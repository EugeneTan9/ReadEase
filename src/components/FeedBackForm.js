import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

/**
 * FeedBackForm Component
 * 
 * A simple feedback form that allows users to submit their name, email, and feedback.
 * The form data is sent to a backend API for processing.
 */
const FeedBackForm = () => {
  // State to store form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  // State to store the message indicating success or failure of form submission
  const [message, setMessage] = useState("");

  /**
   * Handles input field changes and updates the form state.
   * Uses computed property names to dynamically update the corresponding field.
   * 
   * @param {Object} e - Event object from input change
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handles form submission.
   * Sends a POST request to the backend with form data.
   * Displays a success message on successful submission or an error message if the request fails.
   * 
   * @param {Object} e - Event object from form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Feedback submitted successfully!");
        
        // Reset form fields after successful submission
        setFormData({ name: "", email: "", feedback: "" });
      }
    } catch (error) {
      setMessage("Error submitting feedback. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col className="mb-4 shadow p-6 rounded">
          <h2 className="text-center fw-bold mb-4">Feedback Form</h2>

          {/* Display success or error message */}
          {message && (
            <div className="mb-4 p-2 bg-success text-white rounded">
              {message}
            </div>
          )}

          {/* Feedback form */}
          <Form onSubmit={handleSubmit}>
            {/* Name input field */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email input field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Feedback textarea field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Feedback:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit button */}
            <Button variant="primary" type="submit" className="w-100 mb-2">
              Submit Feedback
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default FeedBackForm;
