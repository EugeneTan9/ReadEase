const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to submit feedback
app.post('/api/feedback', (req, res) => {
    const { name, email, feedback } = req.body;
    
    db.run(
        'INSERT INTO user_feedback (name, email, feedback) VALUES (?, ?, ?)',
        [name, email, feedback],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            console.log("SUCCESS")
            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});