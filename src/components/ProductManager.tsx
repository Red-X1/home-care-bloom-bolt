
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import ImageUpload from './ImageUpload';

const ProductManager = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: ''
  });

  const handleAddProduct = async () => {
    const success = await addProduct(newProduct);
    if (success) {
      setNewProduct({ name: '', description: '', price: 0, image: '', category: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateProduct = async (id: number, updatedProduct: Partial<Omit<Product, 'id'>>) => {
    const success = await updateProduct(id, updatedProduct);
    if (success) {
      setEditingId(null);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Загрузка продуктов...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление продуктами</CardTitle>
        <CardDescription>Добавляйте, редактируйте и удаляйте продукты</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Список продуктов</h3>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить продукт
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Добавить новый продукт</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Название продукта"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Input
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Категория продукта"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Описание продукта"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Цена (₽)</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <ImageUpload
                currentImage={newProduct.image}
                onImageChange={(imageUrl) => setNewProduct({ ...newProduct, image: imageUrl })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddProduct}>Добавить</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Отмена</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                isEditing={editingId === product.id}
                onEdit={() => setEditingId(product.id)}
                onSave={(updates) => handleUpdateProduct(product.id, updates)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDeleteProduct(product.id)}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ProductRow = ({
  product,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Omit<Product, 'id'>>) => void;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const [editData, setEditData] = useState(product);

  const handleSave = () => {
    const { id, ...updates } = editData;
    onSave(updates);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <ImageUpload
            currentImage={editData.image}
            onImageChange={(imageUrl) => setEditData({ ...editData, image: imageUrl })}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
          />
        </TableCell>
        <TableCell>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            rows={2}
          />
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{product.price > 0 ? `${product.price}₽` : 'Не указана'}</TableCell>
      <TableCell className="max-w-xs truncate">{product.description}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductManager;
