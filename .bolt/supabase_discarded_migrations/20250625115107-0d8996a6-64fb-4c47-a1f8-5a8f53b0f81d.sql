
-- Проверим и добавим начальные данные для site_content если их нет
INSERT INTO public.site_content (section, content) 
VALUES 
  ('footer', '{
    "companyName": "ЧИСТЫЙ ДОМ",
    "description": "Мы создаем экологически чистые средства для дома и личной гигиены, которые эффективно справляются с загрязнениями, но безопасны для вас, вашей семьи и планеты.",
    "address": "г. Москва, ул. Примерная, д. 123",
    "phone": "+7 (495) 123-45-67",
    "email": "info@chistydom.ru"
  }'::jsonb),
  ('contact', '{
    "title": "Свяжитесь с нами",
    "subtitle": "Мы всегда готовы ответить на ваши вопросы и помочь выбрать подходящие продукты для вашего дома.",
    "address": "г. Москва, ул. Примерная, д. 123, офис 456",
    "phone": "+7 (495) 123-45-67",
    "email": "info@chistydom.ru",
    "workingHours": "Пн-Пт: 9:00 - 18:00\nСб-Вс: Выходные"
  }'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- Включаем RLS для таблицы products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Создаем политику, которая позволяет всем читать продукты
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Создаем политику, которая позволяет всем добавлять продукты (для админ-панели)
CREATE POLICY "Anyone can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем политику, которая позволяет всем обновлять продукты
CREATE POLICY "Anyone can update products" 
  ON public.products 
  FOR UPDATE 
  USING (true);

-- Создаем политику, которая позволяет всем удалять продукты
CREATE POLICY "Anyone can delete products" 
  ON public.products 
  FOR DELETE 
  USING (true);

-- Включаем RLS для таблицы site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Создаем политики для site_content
CREATE POLICY "Anyone can view site content" 
  ON public.site_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can update site content" 
  ON public.site_content 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can insert site content" 
  ON public.site_content 
  FOR INSERT 
  WITH CHECK (true);
