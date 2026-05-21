import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState('osama');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // 🛠️ FIX: قراءة البيانات مباشرة من نفس المفتاح 'cart' لضمان التطابق الكامل
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ==========================================
  // العمليات الحسابية الديناميكية المربوطة بالسلة
  // ==========================================
  const subtotal = cartItems.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  const shipping = cartItems.length > 0 ? 45 : 0; // نفس قيمة الشحن في صفحة السلة
  const tax = Math.round(subtotal * 0.05);       // ضريبة 5%
  const total = subtotal + shipping + tax;

  // دالة إتمام الطلب وتفريغ السلة بعد النجاح
  const handleConfirmOrder = () => {
    setShowSuccess(true);
    localStorage.removeItem('cart'); // مسح السلة من الـ localStorage بعد تأكيد الأوردر
    window.dispatchEvent(new Event('cartUpdated')); // تنبيه باقي الموقع أن السلة فضيت
  };

  return (
    <div className="checkout-wrapper">
      
      <div className={`checkout-container ${showSuccess ? 'content-blur' : ''}`}>
        <h1 className="main-title">Checkout</h1>

        <div className="checkout-content">
       
          <div className="checkout-form">
            
            {/* قسم العنوان */}
            <section className="form-section">
              <h2 className="section-heading">Address</h2>
              <div className="address-input-wrapper">
                <span className="location-icon">📍</span>
                <input type="text" placeholder="e.g., Cairo - Giza, Egypt" />
              </div>
            </section>

            {/* قسم المستلم */}
            <section className="form-section">
              <h2 className="section-heading">Who will receive this order?</h2>
              <div className="receiver-grid">
                <div 
                  className={`receiver-box ${selectedReceiver === 'osama' ? 'active' : ''}`}
                  onClick={() => setSelectedReceiver('osama')}
                >
                  <div className="receiver-info">
                    <span className="name">Osama Al-korashy</span>
                    <span className="phone">+20 100 100 2078</span>
                  </div>
                  {selectedReceiver === 'osama' && <span className="check-mark">✓</span>}
                </div>
                <div className="receiver-box add-new">
                  <span className="plus-icon">+</span>
                  <span>Add someone else</span>
                </div>
              </div>
            </section>

            {/* تعليمات التوصيل */}
            <section className="form-section">
              <div className="flex-header">
                <h2 className="section-heading">Delivery Instructions</h2>
              </div>
              <div className="radio-list">
                <label className="radio-item">
                  <input type="radio" name="delivery" />
                  <span className="custom-radio"></span>
                  🏠 Leave at my door
                </label>
                <label className="radio-item">
                  <input type="radio" name="delivery" defaultChecked />
                  <span className="custom-radio"></span>
                  📞 Call me before arriving
                </label>
              </div>
            </section>

            {/* طريقة الدفع */}
            <section className="form-section">
              <h2 className="section-heading">Pay with</h2>
              <div className="payment-list">
                <label className="payment-item">
                  <input type="radio" name="pay" onChange={() => setPaymentMethod('card')} />
                  <span className="custom-radio"></span>
                  Credit / Debit Card
                  <div className="card-logos">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" />
                  </div>
                </label>
                <label className="payment-item">
                  <input type="radio" name="pay" onChange={() => setPaymentMethod('insta')} />
                  <span className="custom-radio"></span>
                  InstaPay
                </label>
                <label className="payment-item">
                  <input type="radio" name="pay" defaultChecked onChange={() => setPaymentMethod('cash')} />
                  <span className="custom-radio"></span>
                  Cash On Delivery
                </label>
              </div>
            </section>

            {/* أزرار التحكم */}
            <div className="footer-buttons">
              <button 
                className="btn-confirm" 
                onClick={handleConfirmOrder}
                disabled={cartItems.length === 0}
                style={{ opacity: cartItems.length === 0 ? 0.5 : 1, cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                Confirm Order
              </button>
              <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
            </div>
          </div>

          {/* ==========================================
              ملخص الدفع المربوط ديناميكياً بالسلة الحقيقية
              ========================================== */}
          <div className="payment-summary">
            <h2 className="section-heading">Payment Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Order ({cartItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0)} items)</span>
                <span>EGP {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>EGP {tax.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fee</span>
                <span>EGP {shipping.toLocaleString()}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>EGP {total.toLocaleString()}</span> 
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* مودال النجاح عند تأكيد الطلب */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-card">
            <button className="close-x" onClick={() => setShowSuccess(false)}>×</button>
            <div className="modal-body">
              <h2 className="thanks-msg">Thanks for your order!</h2>
              <div className="status-container">
                <p>Your order is on its way</p>
                <div className="plane-icon">✈️</div>
              </div>
              <button className="btn-continue" onClick={() => navigate('/services')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}