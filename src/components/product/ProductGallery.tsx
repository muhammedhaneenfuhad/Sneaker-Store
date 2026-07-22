interface ProductGalleryProps {
  images: string[];
  name: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export function ProductGallery({ images, name, activeIndex, onActiveIndexChange }: ProductGalleryProps) {
  return (
    <div>
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
        <img
          src={images[activeIndex]}
          alt={name}
          className="w-full h-full object-contain p-8"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (  
            <button
              key={img}
              onClick={() => onActiveIndexChange(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors
                ${activeIndex === i ? 'border-black' : 'border-gray-200'}`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}