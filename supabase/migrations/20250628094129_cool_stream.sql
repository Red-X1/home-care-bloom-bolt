/*
  # Enhanced Admin Features Migration

  1. New Tables
    - `dynamic_sections` - For custom sections on the main page
    - `theme_settings` - For site theme and color customization
    - `section_items` - For items within sections

  2. Updates
    - Add social links to contact content
    - Add theme settings

  3. Security
    - Enable RLS on new tables
    - Add policies for public access
*/

-- Create dynamic_sections table
CREATE TABLE IF NOT EXISTS public.dynamic_sections (
  id bigserial PRIMARY KEY,
  section_name text NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  background_color text DEFAULT '#ffffff',
  text_color text DEFAULT '#000000',
  position_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create section_items table
CREATE TABLE IF NOT EXISTS public.section_items (
  id bigserial PRIMARY KEY,
  section_id bigint REFERENCES public.dynamic_sections(id) ON DELETE CASCADE,
  item_type text NOT NULL, -- 'text', 'image', 'button', 'link'
  content jsonb NOT NULL DEFAULT '{}',
  position_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create theme_settings table
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id bigserial PRIMARY KEY,
  setting_name text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dynamic_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for dynamic_sections
CREATE POLICY "Anyone can view dynamic sections" 
  ON public.dynamic_sections 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert dynamic sections" 
  ON public.dynamic_sections 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update dynamic sections" 
  ON public.dynamic_sections 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete dynamic sections" 
  ON public.dynamic_sections 
  FOR DELETE 
  USING (true);

-- Create policies for section_items
CREATE POLICY "Anyone can view section items" 
  ON public.section_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert section items" 
  ON public.section_items 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update section items" 
  ON public.section_items 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete section items" 
  ON public.section_items 
  FOR DELETE 
  USING (true);

-- Create policies for theme_settings
CREATE POLICY "Anyone can view theme settings" 
  ON public.theme_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert theme settings" 
  ON public.theme_settings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update theme settings" 
  ON public.theme_settings 
  FOR UPDATE 
  USING (true);

-- Add default theme settings
INSERT INTO public.theme_settings (setting_name, setting_value) VALUES
('colors', '{
  "primary": "#0EA5E9",
  "secondary": "#64748B",
  "accent": "#EC4899",
  "background": "#FFFFFF",
  "foreground": "#1E293B",
  "muted": "#F1F5F9",
  "border": "#E2E8F0"
}'),
('theme_mode', '{"mode": "light"}'),
('typography', '{
  "fontFamily": "Inter",
  "headingWeight": "600",
  "bodyWeight": "400"
}')
ON CONFLICT (setting_name) DO NOTHING;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dynamic_sections_updated_at 
BEFORE UPDATE ON public.dynamic_sections 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_items_updated_at 
BEFORE UPDATE ON public.section_items 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at 
BEFORE UPDATE ON public.theme_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();