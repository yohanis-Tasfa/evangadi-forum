-- Add accept answer functionality to the answer table
-- Run this SQL script in your database to enable accept answer feature

ALTER TABLE answer 
ADD COLUMN is_accepted TINYINT(1) DEFAULT 0;

-- Add index for better performance when querying accepted answers
CREATE INDEX idx_answer_accepted ON answer(questionid, is_accepted);

-- Optional: Add constraint to ensure only one accepted answer per question
-- Note: This constraint might not work in all MySQL versions, so it's commented out
-- You can enforce this logic in the application instead (which we already do)
-- ALTER TABLE answer ADD CONSTRAINT unique_accepted_per_question 
-- UNIQUE KEY unique_accepted (questionid, is_accepted) WHERE is_accepted = 1;