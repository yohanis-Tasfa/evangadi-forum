-- Add profile fields to users table
-- Run this SQL script in your database to add profile functionality

ALTER TABLE users 
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(255),
ADD COLUMN website VARCHAR(255);

-- Optional: Add created_at if it doesn't exist
-- ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;