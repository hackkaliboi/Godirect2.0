@echo off
echo Applying fix for 'column property_views.viewing_date does not exist' error...

REM Check if we're in the correct directory
if not exist "FIX_TABLE_NAMES.sql" (
    echo Error: FIX_TABLE_NAMES.sql not found in current directory
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo Found FIX_TABLE_NAMES.sql - ready to apply fix

echo Instructions:
echo 1. Go to your Supabase project dashboard
echo 2. Navigate to the SQL Editor
echo 3. Copy and paste the content of FIX_TABLE_NAMES.sql
echo 4. Run the SQL query in your Supabase SQL Editor
echo 5. The fix should now be applied and the error resolved

echo.
echo Documentation:
echo - README_VIEWING_TABLE_FIX.md - Detailed explanation of the fix
echo - FINAL_FIX_SUMMARY.md - Summary of all changes made
echo - TEST_VIEWING_FIX.sql - SQL script to verify the fix

pause