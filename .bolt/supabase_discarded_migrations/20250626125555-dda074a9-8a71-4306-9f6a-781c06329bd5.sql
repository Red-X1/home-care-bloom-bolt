
-- Создаем таблицу для хранения всего контента сайта
CREATE TABLE IF NOT EXISTS public.site_sections (
  id BIGSERIAL PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем данные по умолчанию для всех разделов
INSERT INTO public.site_sections (section_name, content) VALUES
('header', '{
  "logoType": "text",
  "logoText": "ЧИСТЫЙ ДОМ",
  "logoImage": "/lovable-uploads/dbc12c6e-c66a-49b0-87d1-689ef14b8f29.png",
  "navLinks": [
    {"name": "О нас", "href": "#about"},
    {"name": "Продукты", "href": "#products"},
    {"name": "Команда", "href": "#team"},
    {"name": "Галерея", "href": "#gallery"},
    {"name": "Контакты", "href": "#contact"}
  ]
}'),
('hero', '{
  "subtitle": "Экологически чистые средства",
  "title": "ЧИСТОТА И ЗАБОТА О ВАШЕМ ДОМЕ",
  "description": "Создаем бытовую химию, которая эффективно очищает, но бережно относится к вам и окружающей среде",
  "backgroundImage": "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  "primaryButtonText": "Наши продукты",
  "secondaryButtonText": "Узнать больше"
}'),
('about', '{
  "subtitle": "О нашей компании",
  "title": "Наша миссия",
  "description": "Мы создаем экологически чистые средства для дома и личной гигиены, которые эффективно справляются с загрязнениями, но безопасны для вас, вашей семьи и планеты.",
  "secondDescription": "Наша компания основана в 2010 году группой энтузиастов, которые решили изменить подход к бытовой химии. Мы исследуем, разрабатываем и производим продукты, которые делают вашу жизнь чище и безопаснее.",
  "image": "https://images.unsplash.com/photo-1584464957176-ca369c03c82a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
  "buttonText": "Узнать о наших продуктах"
}'),
('team', '{
  "subtitle": "Наша команда",
  "title": "Профессионалы своего дела",
  "description": "Наша команда объединяет опытных специалистов в области химии, экологии и производства, увлеченных идеей создания безопасных средств для дома.",
  "buttonText": "Присоединиться к команде",
  "members": [
    {
      "id": 1,
      "name": "Елена Смирнова",
      "role": "Генеральный директор",
      "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      "id": 2,
      "name": "Андрей Петров",
      "role": "Технический директор",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      "id": 3,
      "name": "Ольга Иванова",
      "role": "Руководитель разработки",
      "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      "id": 4,
      "name": "Михаил Соколов",
      "role": "Маркетинг директор",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    }
  ]
}'),
('gallery', '{
  "subtitle": "Наша галерея",
  "title": "Сделано с любовью",
  "description": "Взгляните на процесс создания наших продуктов — от лаборатории до вашего дома.",
  "images": [
    "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "https://images.unsplash.com/photo-1550963295-019d8a8a61c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1583907659441-addbe699e921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  ]
}')
ON CONFLICT (section_name) DO NOTHING;

-- Создаем функцию для автоматического обновления поля updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_site_sections_updated_at 
BEFORE UPDATE ON public.site_sections 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
