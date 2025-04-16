# Supabase Migrations

This directory contains SQL migration files for setting up and updating the database schema in Supabase.

## Migration Files

1. `create_notifications_table.sql` - Creates the notifications table for the real-time notification system
2. `create_property_images_table.sql` - Creates the property_images table for multiple image uploads
3. `create_support_tickets_table.sql` - Creates tables for the Support Center functionality

## How to Apply Migrations

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to the SQL Editor
4. Copy the contents of each migration file
5. Paste into the SQL Editor
6. Click "Run" to execute the SQL statements

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
# Link to your remote project
supabase link --project-ref jhzaeleoqhxvpzlicmtq

# Push the migrations
supabase db push
```

## Verification

After applying the migrations, verify that the tables were created successfully:

1. Go to the Table Editor in your Supabase dashboard
2. You should see the following new tables:
   - `notifications`
   - `property_images`
   - `support_tickets`
   - `support_ticket_messages`
   - `knowledge_base_articles`

## Next Steps

After creating these tables, update your application code to use them:

1. Update the NotificationSystem component to fetch from the notifications table
2. Modify the AdminProperties component to store image URLs in the property_images table
3. Implement the Support Center UI to interact with the support_tickets table
