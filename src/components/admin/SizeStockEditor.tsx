import { Plus, Trash2 } from 'lucide-react';
import type { ProductSize } from '../../types/product';

interface SizeStockEditorProps {
  sizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}

export function SizeStockEditor({ sizes, onChange }: SizeStockEditorProps) {
  const addRow = () => {
    onChange([...sizes, { value: '', inStock: true, quantity: 0 }]);
  };

  const updateRow = (index: number, updates: Partial<ProductSize>) => {
    onChange(
      sizes.map((s, i) => {
        if (i !== index) return s;
        const merged = { ...s, ...updates };
        // Keep inStock in sync with quantity automatically
        if ('quantity' in updates) {
          merged.inStock = merged.quantity > 0;
        }
        return merged;
      })
    );
  };

  const removeRow = (index: number) => {
    onChange(sizes.filter((_, i) => i !== index));
  };

  const totalStock = sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-700">Sizes & Stock</p>
        <span className="text-xs text-gray-400">Total stock: {totalStock}</span>
      </div>

      <div className="space-y-2">
        {sizes.map((size, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              placeholder="Size (e.g. 42)"
              value={size.value}
              onChange={(e) => updateRow(index, { value: e.target.value })}
              className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              min={0}
              placeholder="Qty"
              value={size.quantity}
              onChange={(e) => updateRow(index, { quantity: Number(e.target.value) })}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
            />
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={size.inStock}
                onChange={(e) => updateRow(index, { inStock: e.target.checked })}
                className="accent-black"
              />
              In stock
            </label>
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-gray-300 hover:text-red-500 ml-auto"
              aria-label="Remove size"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-black"
      >
        <Plus size={14} /> Add size
      </button>
    </div>
  );
}