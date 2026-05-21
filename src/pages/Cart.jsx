import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css'; 

export default function CartPage() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  const loadCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  const updateQty = (id, delta) => {
    const updated = items.map(it =>
      it.id === id ? { ...it, quantity: Math.max(1, (Number(it.quantity) || 1) + delta) } : it
    );
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const remove = (id) => {
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // ==========================================
  // 🛠️ FIX: دالة الصور الذكية (تمنع تكرار المسار)
  // ==========================================
  const getSmartImageSrc = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;

    const baseUrl = import.meta.env.BASE_URL;
    
    // لو المسار أصلاً بيحتوي على الـ BASE_URL (زي ما Services بتبعته)، رجعه زي ما هو!
    if (baseUrl && baseUrl !== '/' && imagePath.startsWith(baseUrl)) {
      return imagePath;
    }

    // لو مفيش فيه BASE_URL، ضيفه
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    return `${cleanBase}${cleanPath}`;
  };

  // ==========================================
  // 🛠️ التعديل الجديد: فحص حالة تسجيل الدخول قبل الدفع
  // ==========================================
  const handleCheckout = () => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isAuth) {
      navigate('/checkout');
    } else {
      alert('Please log in first to proceed to checkout!'); // رسالة تنبيه للمستخدم
      navigate('/login');
    }
  };

  const subtotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  const shipping = items.length > 0 ? 45 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page page-enter">
      <div className="cart-inner">
        <h1 className="cart-title">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <Link to="/services" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => {
                
                // استخدام الدالة الذكية
                const itemImgSrc = getSmartImageSrc(item.image);

                return (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-img">
                      <img 
                        src={itemImgSrc} 
                        alt={item.name} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
                      />
                    </div>
                    
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="cart-item-seller">Seller: {item.seller || 'IndusConnect Official'}</p>
                      <div className="cart-item-controls">
                        <div className="qty-controls">
                          <button onClick={() => updateQty(item.id, -1)}>−</button>
                          <span>{item.quantity || 1}</span>
                          <button onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                        <button className="remove-btn" onClick={() => remove(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      EGP {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal ({items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)} items)</span>
                <span>EGP {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>EGP {shipping}</span>
              </div>
              <div className="summary-line">
                <span>Tax (5%)</span>
                <span>EGP {tax.toLocaleString()}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>EGP {total.toLocaleString()}</span>
              </div>
              
              <button 
                className="btn-primary checkout-btn" 
                onClick={handleCheckout} // 🛠️ ربط الزرار بالدالة الجديدة
              >
                Proceed to Checkout
              </button>
              <Link to="/services" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}