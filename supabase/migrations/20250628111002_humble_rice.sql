/*
  # Create theme_settings table

  1. New Tables
    - `theme_settings`
      - `id` (bigint, primary key, auto-increment)
      - `setting_name` (text, unique, not null) - Name of the theme setting (e.g., 'colors', 'theme_mode', 'typography')
      - `setting_value` (jsonb, not null) - JSON value containing the setting data
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `theme_settings` table
    - Add policy for public read access (theme settings should be publicly readable)
    - Add policy for authenticated users to manage theme settings

  3. Initial Data
    - Insert default theme settings for colors, theme mode, and typography
*/

-- Create the theme_settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  setting_name text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Theme settings are publicly readable"
  ON theme_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage theme settings"
  ON theme_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default theme settings
INSERT INTO theme_settings (setting_name, setting_value) VALUES
  ('colors', '{
    "primary": "#0EA5E9",
    "secondary": "#64748B", 
    "accent": "#EC4899",
    "background": "#FFFFFF",
    "foreground": "#1E293B",
    "muted": "#F1F5F9",
    "border": "#E2E8F0"
  }'::jsonb),
  ('theme_mode', '{"mode": "light"}'::jsonb),
  ('typography', '{
    "fontFamily": "Inter",
    "headingWeight": "600",
    "bodyWeight": "400"
  }'::jsonb)
ON CONFLICT (setting_name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();