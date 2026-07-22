import React, { useState } from 'react';
import { Pencil, Trash2, Plus, Check, X, PackageSearch, Image } from 'lucide-react';
import { useProductCatalog } from '../hooks/useProductCatalog';
import { SizeStockEditor } from '../components/admin/SizeStockEditor';
import { ImageUrlsEditor } from '../components/admin/ImageUrlsEditor';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';
import type { Product, ProductSize } from '../types/product';

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductCatalog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [sizeEditingId, setSizeEditingId] = useState<string | null>(null);
  const [editSizes, setEditSizes] = useState<ProductSize[]>([]);
  const [imageEditingId, setImageEditingId] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const startEditPrice = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(String(p.price));
    setEditDiscount(p.discountPrice != null ? String(p.discountPrice) : '');
  };

  const savePriceEdit = (id: string) => {
    const price = Number(editPrice);
    const discountPrice = editDiscount.trim() ? Number(editDiscount) : undefined;

    if (isNaN(price) || price <= 0) {
      alert('Enter a valid price.');
      return;
    }
    if (discountPrice != null && (isNaN(discountPrice) || discountPrice >= price)) {
      alert('Discount price must be a valid number less than the regular price.');
      return;
    }

    updateProduct(id, { price, discountPrice });
    setEditingId(null);
  };

  const startEditSizes = (p: Product) => {
    setSizeEditingId(p.id);
    setEditSizes(p.sizes.map((s) => ({ ...s })));
  };

  const saveSizeEdit = (id: string) => {
    const cleaned = editSizes.filter((s) => s.value.trim() !== '');
    if (cleaned.length === 0) {
      alert('Add at least one size.');
      return;
    }
    const totalStock = cleaned.reduce((sum, s) => sum + (s.quantity || 0), 0);
    updateProduct(id, { sizes: cleaned, stock: totalStock });
    setSizeEditingId(null);
  };

  const startEditImages = (p: Product) => {
    setImageEditingId(p.id);
    setEditImages([...p.images]);
  };

  const saveImageEdit = (id: string) => {
    const cleaned = editImages.filter((img) => img.trim() !== '');
    if (cleaned.length === 0) {
      alert('Add at least one image.');
      return;
    }
    updateProduct(id, { images: cleaned });
    setImageEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin — Products</h1>
        <Button onClick={() => setShowAddForm((s) => !s)} className="flex items-center gap-1">
          <Plus size={16} /> {showAddForm ? 'Close' : 'Add Product'}
        </Button>
      </div>

      {showAddForm && (
        <AddProductForm
          onAdd={(product) => {
            addProduct(product);
            setShowAddForm(false);
          }}
        />
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Brand</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Discount Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-contain bg-gray-50 rounded" />
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{p.brand}</td>
                  <td className="py-3 pr-4 text-gray-500 capitalize">{p.category}</td>

                  {editingId === p.id ? (
                    <>
                      <td className="py-3 pr-4">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-20 border border-gray-200 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <input
                          type="number"
                          value={editDiscount}
                          onChange={(e) => setEditDiscount(e.target.value)}
                          placeholder="none"
                          className="w-20 border border-gray-200 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{p.stock}</td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2">
                          <button onClick={() => savePriceEdit(p.id)} className="text-green-600 hover:text-green-800">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-700">
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                      <td className="py-3 pr-4">
                        {p.discountPrice ? formatPrice(p.discountPrice) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{p.stock}</td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2">
                          <button onClick={() => startEditPrice(p)} title="Edit price" className="text-gray-400 hover:text-black">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => (sizeEditingId === p.id ? setSizeEditingId(null) : startEditSizes(p))}
                            title="Manage sizes & stock"
                            className="text-gray-400 hover:text-black"
                          >
                            <PackageSearch size={16} />
                          </button>
                          <button
                            onClick={() => (imageEditingId === p.id ? setImageEditingId(null) : startEditImages(p))}
                            title="Manage images"
                            className="text-gray-400 hover:text-black"
                          >
                            <Image size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                            }}
                            title="Delete"
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>

                {sizeEditingId === p.id && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td colSpan={7} className="py-4 px-4">
                      <SizeStockEditor sizes={editSizes} onChange={setEditSizes} />
                      <div className="flex gap-2 mt-3">
                        <Button onClick={() => saveSizeEdit(p.id)} className="text-sm">
                          Save Sizes
                        </Button>
                        <Button variant="outline" onClick={() => setSizeEditingId(null)} className="text-sm">
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {imageEditingId === p.id && (
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td colSpan={7} className="py-4 px-4">
                      <ImageUrlsEditor images={editImages} onChange={setEditImages} />
                      <div className="flex gap-2 mt-3">
                        <Button onClick={() => saveImageEdit(p.id)} className="text-sm">
                          Save Images
                        </Button>
                        <Button variant="outline" onClick={() => setImageEditingId(null)} className="text-sm">
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddProductForm({ onAdd }: { onAdd: (product: Omit<Product, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Product['category']>('running');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [sizes, setSizes] = useState<ProductSize[]>([
    { value: '40', inStock: true, quantity: 5 },
    { value: '41', inStock: true, quantity: 5 },
    { value: '42', inStock: true, quantity: 5 },
  ]);

  const handleSubmit = () => {
    const cleanedImages = images.filter((img) => img.trim() !== '');

    if (!name || !brand || !price || cleanedImages.length === 0) {
      alert('Fill in name, brand, price, and at least one image URL.');
      return;
    }

    const cleanedSizes = sizes.filter((s) => s.value.trim() !== '');
    if (cleanedSizes.length === 0) {
      alert('Add at least one size.');
      return;
    }

    const totalStock = cleanedSizes.reduce((sum, s) => sum + (s.quantity || 0), 0);

    onAdd({
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      brand,
      category,
      description: `${brand} ${name}`,
      price: Number(price),
      currency: 'INR',
      images: cleanedImages,
      colors: [{ name: 'Default', hex: '#000000' }],
      sizes: cleanedSizes,
      gender: 'unisex',
      rating: 0,
      reviewCount: 0,
      isNew: true,
      stock: totalStock,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 mb-4">
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value as Product['category'])} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="running">Running</option>
          <option value="football">Football</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="basketball">Basketball</option>
          <option value="training">Training</option>
          <option value="skateboarding">Skateboarding</option>
        </select>
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
      </div>

      <ImageUrlsEditor images={images} onChange={setImages} />

      <SizeStockEditor sizes={sizes} onChange={setSizes} />

      <Button type="button" onClick={handleSubmit}>Add Product</Button>
    </div>
  );
}