# Database Migrations

## Profile Fields Migration

To enable full profile functionality (bio, location, website), run this SQL in your database:

```sql
ALTER TABLE users 
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(255),
ADD COLUMN website VARCHAR(255);
```

## Why This Migration is Needed

The user profile system includes optional fields for:
- **bio**: User's personal description
- **location**: User's location (City, Country)
- **website**: User's personal website URL

These fields are optional and the system will work without them, but users won't be able to edit their profiles until the migration is applied.

## Current Status

The profile system is designed to be backward-compatible:
- ✅ **Profile viewing works** without migration (shows basic user info + stats)
- ✅ **Statistics work** without migration (questions, answers, reputation)
- ❌ **Profile editing requires** the migration to be applied

## How to Apply

1. Connect to your database (TiDB Cloud, MySQL, etc.)
2. Run the SQL commands above
3. Restart the backend server
4. Profile editing will now be available

## Verification

After applying the migration, users should be able to:
- Click "Edit Profile" on their profile page
- Add bio, location, and website information
- Save changes successfully