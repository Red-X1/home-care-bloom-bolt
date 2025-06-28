
-- Проверим и исправим структуру таблиц site_sections и site_content
-- Убедимся что таблицы существуют и имеют правильную структуру

-- Создаем или обновляем таблицу site_sections если она не существует или имеет неправильную структуру
CREATE TABLE IF NOT EXISTS public.site_sections (
    id bigserial PRIMARY KEY,
    section_name text NOT NULL UNIQUE,
    content jsonb NOT NULL DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Создаем или обновляем таблицу site_content если она не существует или имеет неправильную структуру  
CREATE TABLE IF NOT EXISTS public.site_content (
    id bigserial PRIMARY KEY,
    section text NOT NULL UNIQUE,
    content jsonb NOT NULL DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Добавляем тестовые данные для команды если их нет
INSERT INTO public.site_sections (section_name, content) 
VALUES ('team', '{
  "subtitle": "Наша команда",
  "title": "Профессионалы своего дела", 
  "description": "Наша команда объединяет опытных специалистов в области химии, экологии и производства, увлеченных идеей создания безопасных средств для дома.",
  "buttonText": "Присоединиться к команде",
  "members": [
    {
      "id": 1,
      "name": "Елена Смирнова",
      "role": "Генеральный директор",
      "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      "id": 2,
      "name": "Андрей Петров", 
      "role": "Технический директор",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
    }
  ]
}')
ON CONFLICT (section_name) DO NOTHING;

-- Добавляем тестовые данные для галереи если их нет
INSERT INTO public.site_sections (section_name, content)
VALUES ('gallery', '{
  "subtitle": "Наша галерея",
  "title": "Сделано с любовью",
  "description": "Взгляните на процесс создания наших продуктов — от лаборатории до вашего дома.",
  "images": [
    "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
    "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
  ]
}')
ON CONFLICT (section_name) DO NOTHING;

-- Добавляем тестовые данные для остальных секций если их нет
INSERT INTO public.site_sections (section_name, content)
VALUES ('hero', '{
  "subtitle": "Экологически чистые решения",
  "title": "Сделайте свой дом\\nчище и безопаснее", 
  "description": "Наши продукты созданы из натуральных компонентов без вредных химических веществ. Забота о вашей семье и окружающей среде — наш приоритет.",
  "backgroundImage": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "primaryButtonText": "Смотреть продукты",
  "secondaryButtonText": "Узнать больше"
}')
ON CONFLICT (section_name) DO NOTHING;

INSERT INTO public.site_sections (section_name, content)
VALUES ('about', '{
  "subtitle": "О нашей компании", 
  "title": "Мы создаем безопасные продукты для вашего дома",
  "description": "Наша миссия — производить экологически чистые средства для дома, которые заботятся о здоровье вашей семьи и окружающей среде.",
  "secondDescription": "Мы используем только натуральные компоненты и современные технологии производства.",
  "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "buttonText": "Узнать больше"
}')
ON CONFLICT (section_name) DO NOTHING;

-- Добавляем триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_sections_updated_at ON public.site_sections;
CREATE TRIGGER update_site_sections_updated_at
    BEFORE UPDATE ON public.site_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
