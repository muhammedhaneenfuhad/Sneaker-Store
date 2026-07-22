import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
}

export function Rating({ value, max = 5, size = 14 }: RatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
        />
      ))}
    </div>
  );
}