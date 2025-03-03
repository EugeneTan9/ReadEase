import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const FeedBackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
        <Col  className="shadow p-6 rounded">
          <h2 className="text-center fw-bold mb-4">Feedback Form</h2>
          {message && (
            <div className="mb-4 p-2 bg-success text-white rounded">
              {message}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
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

            <Button variant="primary" type="submit" className="w-100">
              Submit Feedback
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    // <div>
    //   <h2 className="text-2xl font-bold mb-4">Feedback Form</h2>
    //   {message && (
    //     <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
    //       {message}
    //     </div>
    //   )}
    //   <form onSubmit={handleSubmit}>
    //     <Form.Group className="mb-4">
    //       <Form.Label className="fw-bold">Name:</Form.Label>
    //       <Form.Control
    //         type="text"
    //         name="name"
    //         value={formData.name}
    //         onChange={handleChange}
    //         required
    //       />
    //     </Form.Group>

    //     <Form.Group className="mb-4" >
    //       <Form.Label className="fw-bold">Email:</Form.Label>
    //       <Form.Control
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //       />
    //     </Form.Group>

    //     <Form.Group className="mb-4" >
    //       <Form.Label className="fw-bold">Feedback:</Form.Label>
    //       <Form.Control
    //         type="text"
    //         name="feedback"
    //         value={formData.feedback}
    //         onChange={handleChange}
    //         required
    //       />
    //     </Form.Group>
    //     <button
    //       type="submit"
    //       className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    //     >
    //       Submit Feedback
    //     </button>
    //   </form>
    // </div>
  );
};

export default FeedBackForm;
