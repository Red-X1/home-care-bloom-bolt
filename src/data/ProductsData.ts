
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price?: number;
  inStock: boolean;
  features?: string[];
  tags: string[];
}

export const productCategories = [
  { id: 1, name: "Экологичные средства для уборки" },
  { id: 2, name: "Средства для стирки" },
  { id: 3, name: "Средства личной гигиены" }
];

export const allProducts: Product[] = [
  {
    id: 101,
    name: "Универсальный очиститель",
    description: "Эффективно удаляет загрязнения с любых поверхностей, не оставляя разводов.",
    image: "https://images.unsplash.com/photo-1585421514284-efb74320d472?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Экологичные средства для уборки",
    price: 350,
    inStock: true,
    features: ["Без агрессивных химикатов", "Биоразлагаемый", "Безопасен для детей и животных"],
    tags: ["уборка", "экологичный", "универсальный"]
  },
  {
    id: 102,
    name: "Средство для мытья посуды",
    description: "Бережно очищает посуду от жира и загрязнений, сохраняя мягкость кожи рук.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Экологичные средства для уборки",
    price: 280,
    inStock: true,
    features: ["Содержит натуральные масла", "Устраняет неприятные запахи", "Экономичный расход"],
    tags: ["посуда", "экологичный", "кухня"]
  },
  {
    id: 103,
    name: "Чистящее средство для ванной",
    description: "Удаляет известковый налет и ржавчину с минимальными усилиями.",
    image: "https://images.unsplash.com/photo-1527515734278-b2434f7f42b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Экологичные средства для уборки",
    price: 320,
    inStock: true,
    features: ["Антибактериальный эффект", "Без хлора", "Приятный аромат"],
    tags: ["ванная", "экологичный", "известковый налет"]
  },
  {
    id: 201,
    name: "Гель для стирки цветных тканей",
    description: "Бережно очищает ткани, сохраняя яркость цветов даже после многократных стирок.",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Средства для стирки",
    price: 450,
    inStock: true,
    features: ["Защита цвета", "Для всех типов тканей", "Подходит для машинной и ручной стирки"],
    tags: ["стирка", "цветные ткани", "гель"]
  },
  {
    id: 202,
    name: "Порошок для белых тканей",
    description: "Возвращает белизну вещам, безопасно удаляя даже стойкие пятна.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Средства для стирки",
    price: 400,
    inStock: true,
    features: ["Отбеливающий эффект", "Без хлора", "Для всех типов белых тканей"],
    tags: ["стирка", "белые ткани", "порошок"]
  },
  {
    id: 203,
    name: "Кондиционер для белья",
    description: "Придает вещам мягкость и приятный аромат, облегчает глажку.",
    image: "https://images.unsplash.com/photo-1469037784699-75dcf567bef9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Средства для стирки",
    price: 300,
    inStock: false,
    features: ["Антистатический эффект", "Длительный аромат", "Концентрированная формула"],
    tags: ["кондиционер", "ароматизатор", "мягкость"]
  },
  {
    id: 301,
    name: "Шампунь для всех типов волос",
    description: "Бережно очищает волосы и кожу головы, придавая объем и блеск.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Средства личной гигиены",
    price: 420,
    inStock: true,
    features: ["Без сульфатов", "С натуральными экстрактами", "Подходит для ежедневного использования"],
    tags: ["волосы", "шампунь", "натуральный"]
  },
  {
    id: 302,
    name: "Гель для душа",
    description: "Мягко очищает кожу, оставляя ощущение свежести и комфорта.",
    image: "https://images.unsplash.com/photo-1619451683029-e3a56d2f0e7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    category: "Средства личной гигиены",
    price: 380,
    inStock: true,
    features: ["Увлажняющий эффект", "Нейтральный pH", "Приятный аромат"],
    tags: ["гель для душа", "увлажнение", "ежедневный уход"]
  },
  {
    id: 303,
    name: "Зубная паста с фтором",
    description: "Эффективно защищает от кариеса и освежает дыхание.",
    image: "https://images.unsplash.com/photo-1571942676516-bcab84649e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Средства личной гигиены",
    price: 250,
    inStock: true,
    features: ["Защита эмали", "Профилактика кариеса", "Длительная свежесть"],
    tags: ["зубная паста", "фтор", "свежесть"]
  },
];
