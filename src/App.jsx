import { createContext, useContext, useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

// pages import
import { Navbar } from './components/Navbar' 
import { ForgotPassword } from './pages/ForgotPassword' 
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import RFQ from './pages/RFQ'
import Complaint from './pages/Complaint'
import AdminDashboard from './pages/AdminDashboard'
import SupplierDashboard from './pages/SupplierDashboard' 
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'

// ==========================================
// 1. FAVORITES GLOBAL CONTEXT PROVIDER
// ==========================================
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('indus_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('indus_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error("Storage full, resetting favorites");
      setFavorites([]);
    }
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      return prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id];
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

// ==========================================
// 2. SHOPPING CART GLOBAL CONTEXT PROVIDER
// ==========================================
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('indus_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('indus_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

// ==========================================
// 3. ADMIN PROTECTED ROUTE COMPONENT
// ==========================================
function AdminProtectedRoute({ children }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('admin_logged_in') === 'true');
  const [error, setError] = useState('');

  // لو مسجل دخول، اعرض الداشبورد على طول
  if (isAuthenticated) {
    return children;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 🔐 الباسورد بتاع الأدمن هنا (تقدر تغيره براحتك من هنا)
    if (password === 'admin123') {
      localStorage.setItem('admin_logged_in', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid Password!');
    }
  };

  // لو مش مسجل دخول، اعرض شاشة الباسورد
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F4F4F5' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
        <h2 style={{ color: '#111827', marginBottom: '10px', fontSize: '24px' }}>Admin Access</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '25px' }}>Please enter the admin password</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setError(''); }} 
            placeholder="Password..." 
            style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${error ? '#EF4444' : '#D1D5DB'}`, outline: 'none', width: '100%', boxSizing: 'border-box' }}
            autoFocus
          />
          {error && <span style={{ color: '#EF4444', fontSize: '13px', fontWeight: 'bold' }}>{error}</span>}
          <button type="submit" style={{ padding: '12px', backgroundColor: '#C24133', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN APP ROOT COMPONENT WITH ROUTING
// ==========================================
function App() {
  const [isAuth, setIsAuth] = useState(() => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handleAuthSync = () => {
      try {
        setIsAuth(localStorage.getItem('isLoggedIn') === 'true');
      } catch (e) {
        setIsAuth(false);
      }
    };
    window.addEventListener('storage', handleAuthSync);
    const interval = setInterval(handleAuthSync, 500);

    return () => {
      window.removeEventListener('storage', handleAuthSync);
      clearInterval(interval);
    };
  }, []);

  return (
    <FavoritesProvider>
      <CartProvider> 
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 🛠️ تم تغليف لوحة الأدمن بحارس الباسورد الجديد */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            
            {/* لوحة المورد لسه مفتوحة مؤقتاً للاختبار، لو عايز تقفلها ممكن نعملها حارس مشابه */}
            <Route path="/supplier" element={<SupplierDashboard />} />
            
            <Route path="/*" element={
              <div className="app-layout">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cart" element={<Cart />} />
                    
                    <Route 
                      path="/checkout" 
                      element={localStorage.getItem('isLoggedIn') === 'true' ? <Checkout /> : <Navigate to="/login" replace />} 
                    />
                    
                    <Route path="/rfq" element={<RFQ />} />
                    <Route path="/complaint" element={<Complaint />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </HashRouter>
      </CartProvider>
    </FavoritesProvider>
  )
}

export default App;