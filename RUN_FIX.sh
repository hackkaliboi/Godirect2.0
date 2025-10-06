#!/bin/bash

# Script to apply the property_viewings table fix

echo "Applying fix for 'column property_views.viewing_date does not exist' error..."

# Check if we're in the correct directory
if [ ! -f "FIX_TABLE_NAMES.sql" ]; then
    echo "Error: FIX_TABLE_NAMES.sql not found in current directory"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "Found FIX_TABLE_NAMES.sql - ready to apply fix"

echo "Instructions:"
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to the SQL Editor"
echo "3. Copy and paste the content below:"
echo "==================== START SQL CONTENT ===================="
cat FIX_TABLE_NAMES.sql
echo "==================== END SQL CONTENT ===================="

echo ""
echo "4. Run the SQL query in your Supabase SQL Editor"
echo "5. The fix should now be applied and the error resolved"

echo ""
echo "Documentation:"
echo "- README_VIEWING_TABLE_FIX.md - Detailed explanation of the fix"
echo "- FINAL_FIX_SUMMARY.md - Summary of all changes made"
echo "- TEST_VIEWING_FIX.sql - SQL script to verify the fix"