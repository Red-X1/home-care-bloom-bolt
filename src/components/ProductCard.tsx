
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="h-64 overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback image if the original fails to load
            e.currentTarget.src = 'https://images.unsplash.com/photo-1585421514284-efb74320d472?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-brand-dark flex-grow line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          {product.price > 0 && (
            <span className="text-lg font-semibold text-brand-pink ml-2 flex-shrink-0">
              {product.price}₽
            </span>
          )}
        </div>
        {product.category && (
          <Badge variant="secondary" className="mb-3 w-fit">
            {product.category}
          </Badge>
        )}
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3 min-h-[4.5rem]">
          {product.description}
        </p>
        <div className="mt-auto">
          <button className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
