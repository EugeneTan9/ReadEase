// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const db = require('./database'); // Import the SQLite database instance

const app = express(); // Initialize an Express application
const port = 5000; // Define the server port

// Middleware setup
app.use(cors()); // Enable CORS to allow cross-origin requests
app.use(express.json()); // Enable parsing of JSON request bodies

/**
 * Endpoint to submit user feedback.
 * Accepts a JSON request body with `name`, `email`, and `feedback` fields.
 */
app.post('/api/feedback', (req, res) => {
    const { name, email, feedback } = req.body;

    // Validate request body to ensure required fields are present
    if (!name || !email || !feedback) {
        return res.status(400).json({ error: 'All fields (name, email, feedback) are required' });
    }

    // Insert feedback into the database using parameterized query to prevent SQL injection
    db.run(
        'INSERT INTO user_feedback (name, email, feedback) VALUES (?, ?, ?)',
        [name, email, feedback],
        function(err) {
            if (err) {
                // Return a 500 error response if database insertion fails
                return res.status(500).json({ error: err.message });
            }

            console.log('Feedback successfully submitted'); // Log successful submission

            // Return success response with the newly created feedback ID
            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
