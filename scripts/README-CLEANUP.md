# Database Cleanup Scripts

These scripts allow you to reset your GODIRECT Realty platform to a fresh state while preserving all user accounts.

## Available Scripts

### SQL Scripts (Recommended - Simpler)
1. **`preview-cleanup.sql`** - Shows what would be deleted (safe, read-only)
2. **`cleanup-database.sql`** - Performs the actual cleanup (destructive)

### Node.js Scripts (Alternative)
1. **`preview-cleanup.js`** - Shows what would be deleted (safe, read-only)
2. **`cleanup-database.js`** - Performs the actual cleanup (destructive)

## What the cleanup does

### ✅ **PRESERVES** (keeps intact):
- All user accounts (`auth.users`)
- User profiles and settings (`profiles`)
- User authentication and login capabilities

### 🗑️ **REMOVES** (cleans up):
- **Properties**: All property listings and images
- **Sales**: All transaction and sales records
- **Agents**: All agent business data (will be regenerated from user profiles)
- **Clients**: All client and lead data
- **Payments**: All payment and commission records
- **Analytics**: All dashboard statistics and metrics
- **Communications**: All inquiries, notifications, and support tickets
- **User Activity**: All favorites, views, and activity logs
- **Market Data**: All market trends and testimonials

## Prerequisites

1. **Service Role Key**: You need the Supabase service role key
2. **Environment Setup**: Ensure your `.env` file contains:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## How to use

### Option 1: SQL Scripts (Recommended - Simpler)

**Advantages of SQL scripts:**
- No Node.js dependencies required
- Faster execution
- Can be run directly in Supabase SQL Editor
- Transactional (all-or-nothing operation)
- Easier to review and understand

#### Step 1: Preview the cleanup (RECOMMENDED)
Run the preview script in your Supabase SQL Editor or psql:
```sql
-- Copy and paste the contents of preview-cleanup.sql
-- This shows what will be deleted without making changes
```

Or if using psql command line:
```bash
psql -h your-supabase-host -U postgres -d postgres -f scripts/preview-cleanup.sql
```

#### Step 2: Run the actual cleanup
Run the cleanup script in your Supabase SQL Editor or psql:
```sql
-- Copy and paste the contents of cleanup-database.sql
-- This performs the actual deletion
```

Or if using psql command line:
```bash
psql -h your-supabase-host -U postgres -d postgres -f scripts/cleanup-database.sql
```

### Option 2: Node.js Scripts (Alternative)

#### Step 1: Navigate to scripts directory
```bash
cd scripts
```

#### Step 2: Install dependencies (if not already done)
```bash
npm install
```

#### Step 3: Preview what will be deleted (RECOMMENDED)
```bash
# Using npm script
npm run preview-cleanup

# Or directly
node preview-cleanup.js
```

This safe command shows:
- All users that will be preserved
- All data that will be deleted
- Record counts for each table
- Summary statistics

#### Step 4: Run the actual cleanup (if satisfied with preview)
```bash
# Using npm script
npm run cleanup-database

# Or directly
node cleanup-database.js
```

#### Step 5: Confirm the operation
The cleanup script will:
1. Show you all users that will be preserved
2. Ask for confirmation (you must type "YES" exactly)
3. Proceed with the cleanup if confirmed

## Safety Features

- **Confirmation Required**: You must type "YES" exactly to proceed
- **User Verification**: Shows all users before and after cleanup
- **Detailed Logging**: Reports what was cleaned and any errors
- **Graceful Error Handling**: Continues cleanup even if some tables fail

## Example Output

```
🧹 Starting database cleanup...
⚠️  This will remove ALL business data while preserving users!

👥 Found 5 users that will be preserved:
   - admin@godirect.com (admin)
   - agent1@example.com (agent)
   - agent2@example.com (agent)
   - user1@example.com (user)
   - user2@example.com (user)

🗑️  Cleaning up tables...
   Clearing property_views...
   ✅ Cleared 150 records from property_views
   Clearing properties...
   ✅ Cleared 25 records from properties
   ...

🎉 Database cleanup completed successfully!
```

## After Cleanup

Once the cleanup is complete:

1. **Users can still log in** with their existing credentials
2. **Dashboards will show zero values** for properties, sales, etc.
3. **You can start adding fresh data** immediately
4. **Agent profiles** will need to be recreated from the user management panel

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY is required"
- Ensure your `.env` file contains the service role key
- The service role key is different from the anon key
- Get it from your Supabase dashboard → Settings → API

### "Could not clear [table_name]"
- Some tables might not exist yet (this is normal)
- Foreign key constraints are handled automatically
- The script continues even if some tables fail

### "Error checking users"
- Verify your Supabase connection
- Check that the `profiles` table exists
- Ensure RLS policies allow the service role to read

## Recovery

⚠️ **This operation is irreversible!** 

If you need to recover data:
1. Restore from a Supabase backup (if available)
2. Re-import data from external sources
3. Manually recreate the data

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your Supabase configuration
3. Ensure you have the correct permissions
4. Contact your development team for assistance