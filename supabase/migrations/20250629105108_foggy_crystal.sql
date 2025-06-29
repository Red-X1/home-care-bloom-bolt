/*
  # Add image size support to section items

  1. Updates
    - Add image size support to section_items content field
    - This allows storing image size preferences (small, medium, large)

  2. Notes
    - No schema changes needed as content is already JSONB
    - This migration documents the feature addition
*/

-- Add a comment to document the image size feature
COMMENT ON COLUMN public.section_items.content IS 'JSONB content for section items. For images, includes: url, alt, size (small/medium/large)';

-- Update existing image items to have default medium size if not set
UPDATE public.section_items 
SET content = content || '{"size": "medium"}'::jsonb
WHERE item_type = 'image' 
AND NOT (content ? 'size');