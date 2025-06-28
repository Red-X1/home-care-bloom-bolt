/*
  # Fix migration and add initial data

  1. Initial Data
    - Add footer content to site_content table
    - Add contact content to site_content table
  
  2. Security Policies
    - Create RLS policies for products table (with IF NOT EXISTS checks)
    - Create RLS policies for site_content table (with IF NOT EXISTS checks)
  
  3. Sample Products
    - Add some sample products to demonstrate functionality
*/

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

-- Включаем RLS для таблиц если еще не включен
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'products' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'site_content' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Создаем политики для products только если они не существуют
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Public can view products'
  ) THEN
    CREATE POLICY "Public can view products" 
      ON public.products 
      FOR SELECT 
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can insert products'
  ) THEN
    CREATE POLICY "Anyone can insert products" 
      ON public.products 
      FOR INSERT 
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can update products'
  ) THEN
    CREATE POLICY "Anyone can update products" 
      ON public.products 
      FOR UPDATE 
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can delete products'
  ) THEN
    CREATE POLICY "Anyone can delete products" 
      ON public.products 
      FOR DELETE 
      USING (true);
  END IF;
END $$;

-- Создаем политики для site_content только если они не существуют
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_content' AND policyname = 'Public can view site content'
  ) THEN
    CREATE POLICY "Public can view site content" 
      ON public.site_content 
      FOR SELECT 
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_content' AND policyname = 'Anyone can update site content'
  ) THEN
    CREATE POLICY "Anyone can update site content" 
      ON public.site_content 
      FOR UPDATE 
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_content' AND policyname = 'Anyone can insert site content'
  ) THEN
    CREATE POLICY "Anyone can insert site content" 
      ON public.site_content 
      FOR INSERT 
      WITH CHECK (true);
  END IF;
END $$;

-- Добавляем примеры продуктов если таблица пустая
INSERT INTO public.products (name, description, price, image, category)
SELECT * FROM (VALUES
  ('Универсальный очиститель', 'Эффективно удаляет загрязнения с любых поверхностей, не оставляя разводов. Создан на основе натуральных компонентов.', 350, 'https://images.unsplash.com/photo-1585421514284-efb74320d472?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'Средства для уборки'),
  ('Средство для мытья посуды', 'Бережно очищает посуду от жира и загрязнений, сохраняя мягкость кожи рук. Содержит натуральные масла.', 280, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'Средства для уборки'),
  ('Гель для стирки цветных тканей', 'Бережно очищает ткани, сохраняя яркость цветов даже после многократных стирок. Подходит для всех типов тканей.', 450, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'Средства для стирки'),
  ('Шампунь для всех типов волос', 'Бережно очищает волосы и кожу головы, придавая объем и блеск. Без сульфатов, с натуральными экстрактами.', 420, 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'Средства личной гигиены'),
  ('Гель для душа', 'Мягко очищает кожу, оставляя ощущение свежести и комфорта. Увлажняющий эффект, нейтральный pH.', 380, 'https://images.unsplash.com/photo-1619451683029-e3a56d2f0e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80', 'Средства личной гигиены'),
  ('Чистящее средство для ванной', 'Удаляет известковый налет и ржавчину с минимальными усилиями. Антибактериальный эффект, без хлора.', 320, 'https://images.unsplash.com/photo-1527515734278-b2434f7f42b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'Средства для уборки')
) AS v(name, description, price, image, category)
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);