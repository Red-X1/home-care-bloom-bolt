
import { useState, useEffect } from 'react';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useSiteSections } from '@/hooks/useSiteSections';

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { categories } = useCategories();
  const { products, loading, error, refetch } = useProducts();
  const { getSection } = useSiteSections();

  const content = getSection('products') || {
    subtitle: 'Наши продукты',
    title: 'Каталог продукции',
    description: 'Высококачественные экологически чистые средства для вашего дома'
  };

  console.log('Products component debug:', {
    products: products.length,
    filteredProducts: filteredProducts.length,
    loading,
    error,
    selectedCategory,
    searchQuery
  });

  useEffect(() => {
    console.log('Filtering products...');
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== null) {
      console.log('Filtering by category:', selectedCategory);
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      console.log('Filtering by search query:', query);
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    console.log('Filtered products result:', filtered.length);
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string | null) => {
    console.log('Category changed to:', category);
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    console.log('Search query changed to:', query);
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <section id="products" className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-brand-pink font-medium text-sm uppercase tracking-wider mb-4">
              {content.subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              {content.title}
            </h2>
          </div>
          <LoadingSpinner message="Загрузка продуктов..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-brand-pink font-medium text-sm uppercase tracking-wider mb-4">
              {content.subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              {content.title}
            </h2>
          </div>
          <ErrorMessage
            message="Ошибка загрузки продуктов. Попробуйте обновить страницу."
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="font-medium text-sm uppercase tracking-wider mb-4 text-brand-pink">
            {content.subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="mb-8">
          <ProductSearch onSearch={handleSearch} />
        </div>

        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}

        {/* Updated grid with auto-fit and equal heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                {products.length === 0
                  ? "Продукты не найдены. Добавьте продукты через админ-панель."
                  : searchQuery
                  ? `Нет результатов по запросу "${searchQuery}"`
                  : selectedCategory
                  ? `Нет продуктов в категории "${selectedCategory}"`
                  : "Продукты не найдены"
                }
              </p>
              {(searchQuery || selectedCategory) && products.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-2 text-brand-pink hover:underline"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
