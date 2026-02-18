# Database Migrations

## Profile Fields Migration

To enable full profile functionality (bio, location, website), run this SQL in your database:

```sql
ALTER TABLE users 
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(255),
ADD COLUMN website VARCHAR(255);
```

## Accept Answer Migration

To enable accept answer functionality, run this SQL in your database:

```sql
ALTER TABLE answer 
ADD COLUMN is_accepted TINYINT(1) DEFAULT 0;

CREATE INDEX idx_answer_accepted ON answer(questionid, is_accepted);
```

## Why These Migrations are Needed

### Profile Fields
The user profile system includes optional fields for:
- **bio**: User's personal description
- **location**: User's location (City, Country)
- **website**: User's personal website URL

### Accept Answer Feature
The accept answer system allows:
- **Question owners** to mark one answer as "accepted"
- **Accepted answers** appear at the top with visual indicators
- **Reputation bonus** (+15 points) for users with accepted answers
- **Better answer organization** (accepted first, then by votes/date)

## Current Status

The systems are designed to be backward-compatible:
- ✅ **Profile viewing works** without migration (shows basic user info + stats)
- ✅ **Answer viewing works** without migration (shows all answers normally)
- ❌ **Profile editing requires** the profile migration
- ❌ **Accept answer requires** the accept answer migration

## How to Apply

1. Connect to your database (TiDB Cloud, MySQL, etc.)
2. Run the SQL commands above
3. Restart the backend server
4. Features will now be available

## Verification

After applying the migrations, users should be able to:

### Profile Features:
- Click "Edit Profile" on their profile page
- Add bio, location, and website information
- Save changes successfully

### Accept Answer Features:
- Question owners see "Accept Answer" buttons on answers
- Click to accept an answer (turns green with checkmark)
- Accepted answers appear at the top
- Accepted answers show "Accepted Answer" badge
- User profiles show "Accepted Answers" count
- Reputation increases by +15 for each accepted answer