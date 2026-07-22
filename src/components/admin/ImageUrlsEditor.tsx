import { Plus, Trash2, ImageOff } from 'lucide-react';

interface ImageUrlsEditorProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUrlsEditor({ images, onChange }: ImageUrlsEditorProps) {
  const addRow = () => {
    onChange([...images, '']);
  };

  const updateRow = (index: number, value: string) => {
    onChange(images.map((img, i) => (i === index ? value : img)));
  };

  const removeRow = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-xs font-medium text-gray-700 mb-2">Images</p>

      <div className="space-y-2">
        {images.map((img, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {img ? (
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <ImageOff size={14} className="text-gray-300" />
              )}
            </div>
            <input
              placeholder="Image URL (e.g. /shoe.jpg or https://...)"
              value={img}
              onChange={(e) => updateRow(index, e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-gray-300 hover:text-red-500"
              aria-label="Remove image"
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
        <Plus size={14} /> Add image
      </button>
    </div>
  );
}