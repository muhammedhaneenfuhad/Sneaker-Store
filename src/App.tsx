import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { NotFound } from './pages/NotFound';
import { Wishlist } from './pages/Wishlist';
import { Orders } from './pages/Orders';
import { Addresses } from './pages/Addresses';
import { SearchResults } from './pages/SearchResults';
import { AdminProducts } from './pages/AdminProducts';
import { Profile } from './pages/Profile';
import { AdminOrders } from './pages/AdminOrders';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/profile" element={<Profile />} />
       <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </Layout>
  );
}

export default App;