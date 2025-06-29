/*
  # Remove dynamic sections functionality

  1. Drop Tables
    - Drop section_items table (with foreign key dependency)
    - Drop dynamic_sections table
    - Drop theme_settings table

  2. Clean up
    - Remove all related policies, triggers, and indexes
    - Remove the update_updated_at_column function if no other tables use it
*/

-- Drop section_items table first (due to foreign key dependency)
DROP TABLE IF EXISTS section_items CASCADE;

-- Drop dynamic_sections table
DROP TABLE IF EXISTS dynamic_sections CASCADE;

-- Drop theme_settings table
DROP TABLE IF EXISTS theme_settings CASCADE;

-- Check if update_updated_at_column function is used by other tables
-- If not used by any other tables, we can drop it
DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    -- Count triggers that use the update_updated_at_column function
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers
    WHERE action_statement LIKE '%update_updated_at_column%';
    
    -- If no triggers use this function, drop it
    IF trigger_count = 0 THEN
        DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    END IF;
END $$;