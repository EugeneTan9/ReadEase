// Import the sqlite3 library with verbose mode enabled for enhanced debugging
const sqlite3 = require('sqlite3').verbose();

// Establish a connection to the SQLite database
const db = new sqlite3.Database('./feedback.db', (err) => {
    if (err) {
        // Log an error message if the database connection fails
        console.error('Error opening database:', err);
    } else {
        // Log success message and initialize database tables
        console.log('Connected to SQLite database');
        createTables();
    }
});

/**
 * Creates the 'user_feedback' table if it does not already exist.
 * The table stores user feedback along with timestamps.
 */
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS user_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier for each feedback entry
            name TEXT NOT NULL,                    -- User's name (required)
            email TEXT NOT NULL,                   -- User's email address (required)
            feedback TEXT NOT NULL,                -- Feedback content (required)
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Timestamp of feedback submission
        )
    `);
}

// Export the database instance for use in other modules
module.exports = db;
