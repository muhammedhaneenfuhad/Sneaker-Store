export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Sneaker Store. All rights reserved.
      </div>
    </footer>
  );
}