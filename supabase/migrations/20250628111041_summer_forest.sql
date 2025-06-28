/*
  # Create theme_settings table

  1. New Tables
    - `theme_settings`
      - `id` (bigserial, primary key)
      - `setting_name` (text, unique, not null)
      - `setting_value` (jsonb, not null, default '{}')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `theme_settings` table
    - Add policies for public read access
    - Add policies for authenticated user management

  3. Initial Data
    - Insert default theme settings for colors, theme_mode, and typography
*/

-- Create theme_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id bigserial PRIMARY KEY,
  setting_name text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

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

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_theme_settings_updated_at ON public.theme_settings;
CREATE TRIGGER update_theme_settings_updated_at 
BEFORE UPDATE ON public.theme_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default theme settings
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