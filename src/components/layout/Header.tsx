import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { ShoppingBag, Search, User, X, Heart, Menu, Package } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useProductCatalog } from '../../hooks/useProductCatalog';
import { CartDrawer } from '../cart/CartDrawer';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Running', to: '/shop/running' },
  { label: 'Football', to: '/shop/football' },
  { label: 'Lifestyle', to: '/shop/lifestyle' },
  { label: 'All', to: '/shop' },
];

export function Header() {
  const { totalItems } = useCart();
  const { totalWishlisted } = useWishlist();
  const { products } = useProductCatalog();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products.slice(0, 6);
    }

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...(product.tags ?? []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, products]);

  const handleSearchSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <>
     <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 [will-change:transform]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="text-xl font-bold tracking-tight">
            SNEAK<span className="text-gray-400">R</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-gray-500">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((open) => !open)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {searchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {searchOpen && (
                <div className="fixed inset-x-4 top-16  z-50 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl sm:absolute sm:inset-auto sm:right-0 sm:top-12 sm:w-80 ">
                  <form onSubmit={handleSearchSubmit}>
                   <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search shoes, brands, or categories"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base sm:text-sm outline-none focus:border-black"
                    />
                  </form>

                  <div className="mt-3 max-h-72 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery('');
                          }}
                          className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-gray-50"
                        >
                          <span>
                            <span className="font-medium text-gray-900">{product.name}</span>
                            <span className="block text-xs text-gray-500">{product.brand} • {product.category}</span>
                          </span>
                          <span className="text-xs text-gray-400">View</span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-2 py-3 text-sm text-gray-500">No matching items found.</p>
                    )}
                  </div>

                  {query.trim() && (
                    <button
                      onClick={() => handleSearchSubmit()}
                      className="w-full mt-2 pt-2 border-t border-gray-100 text-sm text-center text-gray-500 hover:text-black"
                    >
                      View all results for "{query}"
                    </button>
                  )}
                </div>
              )}
            </div>

           <Link to="/profile" aria-label="Account" className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Wishlist">
              <Heart size={20} />
              {totalWishlisted > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalWishlisted}
                </span>
              )}
            </Link>

            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <Link to="/orders" className="p-2 rounded-full hover:bg-gray-100" aria-label="Orders">
              <Package size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile nav backdrop */}
      <div
        onClick={() => setMobileNavOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/40 z-50 transition-opacity
          ${mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Mobile nav drawer — slides in from the left */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl
          transform transition-transform duration-300 flex flex-col
          ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="text-lg font-bold tracking-tight">
            SNEAK<span className="text-gray-400">R</span>
          </span>
          <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col p-5 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileNavOpen(false)}
              className="py-3 px-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-3 pt-3">
            <Link
              to="/wishlist"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 py-3 px-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
            >
              <Heart size={18} /> Wishlist
            </Link>

            <Link
              to="/orders"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 py-3 px-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
            >
              <Package size={18} /> My Orders
            </Link>
            <Link
                to="/profile"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 py-3 px-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-50"
              >
                <User size={18} /> My Account
              </Link>
          </div>
        </nav>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}