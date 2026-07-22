import type{ ProductSize } from '../../types/product';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Select Size</p>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            disabled={!size.inStock}
            onClick={() => onSelect(size.value)}
            className={`py-2 rounded-lg text-sm font-medium border transition-colors
              ${selected === size.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-800 border-gray-200 hover:border-black'}
              ${!size.inStock ? 'opacity-30 cursor-not-allowed line-through' : ''}
            `}
          >
            {size.value}
          </button>
        ))}
      </div>
    </div>
  );
}