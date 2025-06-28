import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from Supabase...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setError('Не удалось загрузить продукты');
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить продукты",
          variant: "destructive",
        });
        return;
      }

      console.log('Products fetched successfully:', data);
      
      // Преобразуем данные в нужный формат
      const formattedProducts = (data || []).map(item => ({
        id: item.id,
        name: item.name || 'Без названия',
        description: item.description || 'Без описания',
        price: item.price || 0,
        image: item.image || 'https://images.unsplash.com/photo-1585421514284-efb74320d472?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        category: item.category || 'Без категории'
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Не удалось загрузить продукты');
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить продукты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось добавить продукт",
          variant: "destructive",
        });
        return false;
      }

      const formattedProduct = {
        id: data.id,
        name: data.name || 'Без названия',
        description: data.description || 'Без описания',
        price: data.price || 0,
        image: data.image || 'https://images.unsplash.com/photo-1585421514284-efb74320d472?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        category: data.category || 'Без категории'
      };

      setProducts(prev => [formattedProduct, ...prev]);
      toast({
        title: "Успех",
        description: "Продукт успешно добавлен",
      });
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить продукт",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Omit<Product, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить продукт",
          variant: "destructive",
        });
        return false;
      }

      const formattedProduct = {
        id: data.id,
        name: data.name || 'Без названия',
        description: data.description || 'Без описания',
        price: data.price || 0,
        image: data.image || 'https://images.unsplash.com/photo-1585421514284-efb74320d472?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        category: data.category || 'Без категории'
      };

      setProducts(prev => prev.map(p => p.id === id ? formattedProduct : p));
      toast({
        title: "Успех",
        description: "Продукт успешно обновлен",
      });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить продукт",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить продукт",
          variant: "destructive",
        });
        return false;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Успех",
        description: "Продукт успешно удален",
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить продукт",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};