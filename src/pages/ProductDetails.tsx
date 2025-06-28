
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { allProducts, productCategories, type Product } from '../data/ProductsData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";

const ProductDetails = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || 'all');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const selectedCategoryName = categoryId 
    ? productCategories.find(cat => cat.id === parseInt(categoryId))?.name 
    : 'все категории';

  useEffect(() => {
    let filtered = [...allProducts];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryName = productCategories.find(cat => 
        cat.id === parseInt(selectedCategory))?.name || '';
      filtered = filtered.filter(product => product.category === categoryName);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Filter by in stock
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, showInStockOnly]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-custom">
        <div className="mb-10">
          <div className="flex items-center mb-2">
            <Link to="/" className="text-brand-pink hover:underline">Главная</Link>
            <span className="mx-2">→</span>
            <span className="text-gray-600">Каталог</span>
          </div>
          <h1 className="section-title">Каталог продукции</h1>
          <p className="text-lg text-gray-600 mt-2">
            {selectedCategoryName 
              ? `Представлены товары из категории "${selectedCategoryName}"` 
              : 'Полный каталог нашей продукции'}
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Поиск продуктов..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stock" 
                  checked={showInStockOnly}
                  onCheckedChange={(checked) => 
                    setShowInStockOnly(checked as boolean)
                  }
                />
                <label
                  htmlFor="stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Только в наличии
                </label>
              </div>
              
              <Button variant="outline" size="icon" className="ml-auto">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-60 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-brand-dark">{product.name}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                    >
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-pink">
                      {product.price} ₽
                    </span>
                    <Button size="sm">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2">Товары не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
