interface PriceProps {
  price: number;
  discountPrice?: number;
  currency?: string;
  className?: string;
}

export function Price({ price, discountPrice, currency = '₹', className = '' }: PriceProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {discountPrice ? (
        <>
          <span className="font-semibold text-gray-900">{currency}{discountPrice}</span>
          <span className="text-sm text-gray-400 line-through">{currency}{price}</span>
        </>
      ) : (
        <span className="font-semibold text-gray-900">{currency}{price}</span>
      )}
    </div>
  );
}