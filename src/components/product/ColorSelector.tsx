import type { ProductColor } from '../../types/product';

interface ColorSelectorProps {
  colors: ProductColor[];
  selected: string;
  onSelect: (colorName: string) => void;
}

export function ColorSelector({ colors, selected, onSelect }: ColorSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        Color: <span className="font-normal text-gray-500">{selected}</span>
      </p>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onSelect(color.name)}
            title={color.name}
            className={`w-8 h-8 rounded-full border-2 transition-all
              ${selected === color.name ? 'border-black scale-110' : 'border-gray-200'}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  );
}