import React, { useState, useEffect } from 'react';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { ToastProvider } from './Context/ToastContext';
import ProductDetailsPage from './Pages/ProductDetails';
import AdminDashboard from './Admin/Dashboard';
import AdminLayout from './Admin/AdminLayout';
import AdminLogin from './Admin/AdminLogin';
import api from './Services/Api';
import { toast } from 'react-toastify';
import CheckoutPage from './Components/CheckoutPage';
import CartPage from './Components/CartPage';
import AccountPage from './Components/AccountPage';
import AdminBookings from './Admin/AdminBookings';
import SecondhandPage from './Components/SecondhandPage';
import AgriFeedPage from './Components/AgrifeedPage';

const API = 'https://buybybest-back-end.onrender.com/api';

// ─── Flatten populated cart from server into a simple flat array ───
// Server returns: { items: [{ productId: { _id, name, price, ... }, quantity: N }] }
// We produce:     [{ _id, productId, name, price, originalPrice, discount, stock, images, quantity }]
const flattenCart = (items = []) =>
  items
    .filter((i) => i.productId && typeof i.productId === 'object')
    .map((i) => {
      const p = i.productId;
      return {
        _id:           String(p._id),
        productId:     String(p._id),
        name:          p.name          || '',
        category:      p.category      || '',
        images:        p.images        || [],
        price:         Number(p.price)         || 0,
        originalPrice: Number(p.originalPrice) || 0,
        discount:      Number(p.discount)      || 0,
        stock:         Number(p.stock ?? p.quantity) || 0,
        quantity:      Number(i.quantity)      || 1,
      };
    });

// ─── Compute cart count from flat array ───
const countItems = (flat) => flat.reduce((s, i) => s + i.quantity, 0);

const App = () => {
  const [currentPage, setCurrentPage]         = useState('home');
  const [currentUser, setCurrentUser]         = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdminLogged, setIsAdminLogged]     = useState(false);
  const [adminLoading, setAdminLoading]       = useState(true);
  const [cart, setCart]                       = useState([]);
  const [cartCount, setCartCount]             = useState(0);
  const [filters, setFilters]                 = useState({ category: '', query: '' });
const [adminPage, setAdminPage] = useState("dashboard");

  const handleSearch = ({ category, query }) => setFilters({ category, query });

  // ── Helper: apply flat cart to state ──
  const applyCart = (flat) => {
    setCart(flat);
    setCartCount(countItems(flat));
  };

  // ── Restore session on mount ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setCurrentUser(user);
      loadCartFromServer();
    }
  }, []);

  // ── Verify admin token ──
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const result = await api.verifyAdminToken(token);
          if (result.admin) {
            setIsAdminLogged(true);
          } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        } catch {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      }
      setAdminLoading(false);
    };
    verifyAdmin();
  }, []);

  // ── URL routing ──
  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (path === 'admin')         setCurrentPage('admin');
    else if (path === 'login')    setCurrentPage('login');
    else if (path === 'register') setCurrentPage('register');
    else                          setCurrentPage('home');
  }, []);

  // ── Load cart from server ──
  const loadCartFromServer = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res  = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.items) applyCart(flattenCart(data.items));
    } catch (err) {
      console.error('Cart load failed', err);
    }
  };

  // ── Navigate ──
  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'productDetails' && data) {
      setSelectedProduct(data);
      window.scrollTo(0, 0);
    }
    if (page === 'home') setSelectedProduct(null);
  };

  // ── Add to cart ──
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login first');
      setCurrentPage('login');
      return;
    }
    try {
      const res  = await fetch(`${API}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const data = await res.json();
      if (data?.items) applyCart(flattenCart(data.items));
      // toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  // ── Update quantity — PERSISTS TO SERVER ──
  const handleUpdateCart = async (productId, newQuantity) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistic update so UI feels instant
    const optimistic = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    applyCart(optimistic);

    try {
      const res = await fetch(`${API}/cart/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      const data = await res.json();
      // Reconcile with server truth
      if (data?.items) applyCart(flattenCart(data.items));
    } catch {
      toast.error('Failed to update quantity');
      // Revert on error
      loadCartFromServer();
    }
  };

  // ── Remove from cart ──
  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem('token');

    // Optimistic remove
    const optimistic = cart.filter((item) => item.productId !== productId);
    applyCart(optimistic);

    try {
      const res = await fetch(`${API}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data?.items) applyCart(flattenCart(data.items));
    } catch {
      toast.error('Failed to remove item');
      loadCartFromServer();
    }
  };

  // ── Clear cart after order ──
  const handleClearCart = () => applyCart([]);

  // ── Auth ──
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    applyCart([]);
    setCurrentPage('home');
    toast.success('Logged out successfully!');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLogged(false);
    toast.success('Admin logged out successfully!');
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    loadCartFromServer();
    toast.success('Login successful!');
  };

  const handleAdminLogin = () => {
    setIsAdminLogged(true);
    toast.success('Admin login successful!');
  };

  if (currentPage === 'admin' && adminLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const hideChrome = ['login', 'register', 'admin'].includes(currentPage);

  return (
    <ToastProvider>
      <div className="d-flex flex-column min-vh-100">
        {!hideChrome && (
          <Navbar
            currentUser={currentUser}
            cartCount={cartCount}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onSearch={handleSearch}
          />
        )}

        <div className="flex-grow-1">
          {currentPage === 'home' && (
            <Home
              filters={filters}
              onSelectProduct={setSelectedProduct}
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
            />
          )}
          {currentPage === 'login' && (
            <Login onLogin={handleLogin} onNavigate={(p) => setCurrentPage(p)} />
          )}
          {currentPage === 'register' && (
            <Register onLogin={handleLogin} onNavigate={(p) => setCurrentPage(p)} />
          )}
          {currentPage === 'productDetails' && selectedProduct && (
            <ProductDetailsPage
              product={selectedProduct}
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
            />
          )}
          {currentPage === 'cart' && (
            <CartPage
              cart={cart}
              onUpdateCart={handleUpdateCart}
              onRemoveFromCart={handleRemoveFromCart}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'checkout' && (
            <CheckoutPage
              cart={cart}
              onNavigate={handleNavigate}
              user={currentUser} 
              onClearCart={handleClearCart}
            />
          )}
          {currentPage === 'account' && (
  <AccountPage
    user={currentUser}
    onNavigate={handleNavigate}
    onLogout={handleLogout}
  />
)}
{currentPage === 'secondhand' && (
  <SecondhandPage onNavigate={handleNavigate} />
)}
{currentPage === 'agrifeed' && (
  <AgriFeedPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
)}
          {currentPage === 'admin' && !isAdminLogged && (
            <AdminLogin onAdminLogin={handleAdminLogin} />
          )}
          {currentPage === 'admin' && isAdminLogged && (
            <AdminLayout onLogout={handleAdminLogout} activePage={adminPage} onNavigate={(p) => setAdminPage(p)}>
               {adminPage === "dashboard" && <AdminDashboard />}
    {adminPage === "bookings"  && <AdminBookings/>}
            </AdminLayout>
          )}
        </div>

        {!hideChrome && <Footer />}
      </div>
    </ToastProvider>
  );
};

export default App;