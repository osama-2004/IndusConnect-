import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFavorites, useCart } from '../App'; 
import './Profile.css'
import { DEFAULT_PRODUCTS } from './Services'; // 🛠️ استخدمنا الداتا الحقيقية بدل الثابتة

// ==========================================
// USER PROFILE COMPONENT
// ==========================================
export default function Profile() {
  const [activeTab, setActiveTab] = useState('wishlist');
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 
  
  // استدعاء الهوكس العالمية للمفضلة والسلة
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart(); 
  
  // 🛠️ جلب كل المنتجات (الافتراضية + اللي ضافها المورد/الأدمن) عشان الـ Wishlist تبقى ديناميكية
  const [globalProducts, setGlobalProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('indus_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  });

  // قراءة بيانات البروفايل
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('indus_user_profile');
      return savedUser ? JSON.parse(savedUser) : {
        name: 'Osama Al-korashy',
        email: 'osamaalkorashy28@gmail.com',
        phone: '+20 100 123 4567',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150'
      };
    } catch (e) {
      return {
        name: 'Osama Al-korashy',
        email: 'osamaalkorashy28@gmail.com',
        phone: '+20 100 123 4567',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150'
      };
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  // 🛠️ ربط المفضلة بالمنتجات الحقيقية
  const wishlistProducts = globalProducts.filter(product => isFavorite(product.id));

  // 🛠️ التعديل الأهم: ضغط الصورة الشخصية قبل حفظها لمنع انهيار الذاكرة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 200; // أبعاد صغيرة ومناسبة لصورة البروفايل
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) { height *= MAX_DIMENSION / width; width = MAX_DIMENSION; }
        } else {
          if (height > MAX_DIMENSION) { width *= MAX_DIMENSION / height; height = MAX_DIMENSION; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // ضغط الصورة وحفظها
        const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
        
        setUser(prev => {
          const updatedUser = { ...prev, image: compressedImage };
          try {
            localStorage.setItem('indus_user_profile', JSON.stringify(updatedUser)); 
          } catch (error) {
            console.warn("Storage Full during profile save.");
          }
          return updatedUser;
        });
        setEditedUser(prev => ({ ...prev, image: compressedImage }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // دالة حفظ التعديلات
  const handleSaveProfile = () => {
    setUser(editedUser);
    setIsEditingProfile(false);
    try {
      localStorage.setItem('indus_user_profile', JSON.stringify(editedUser)); 
    } catch (error) {
      console.warn("Storage Full");
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    addToCart(product); 
  };

  return (
    <div className="account-container">
      <div className="account-layout">
        
        <aside className="account-sidebar">
          
          <div className="user-info-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
            
            <div 
              className="user-avatar-wrapper" 
              style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '15px', cursor: 'pointer' }}
              onClick={() => fileInputRef.current.click()}
              title="تغيير الصورة الشخصية"
            >
              <img 
                src={user.image} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E5E7EB' }} 
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#C24133', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '2px solid #fff' }}>
                📷
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>

            {isEditingProfile ? (
              <div className="edit-profile-form" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  value={editedUser.name} 
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})} 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', textAlign: 'center', fontSize: '14px' }}
                />
                <input 
                  type="email" 
                  value={editedUser.email} 
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})} 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', textAlign: 'center', fontSize: '14px' }}
                />
                <input 
                  type="text" 
                  value={editedUser.phone} 
                  onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})} 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', textAlign: 'center', fontSize: '14px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '5px' }}>
                  <button onClick={() => {setIsEditingProfile(false); setEditedUser(user);}} style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                  <button onClick={handleSaveProfile} style={{ padding: '6px 15px', borderRadius: '15px', border: 'none', background: '#C24133', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Save</button>
                </div>
              </div>
            ) : (
              <div className="user-details">
                <h4 style={{ margin: '0 0 5px 0', color: '#111827' }}>{user.name}</h4>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#6B7280' }}>{user.email}</p>
                <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#6B7280' }}>{user.phone}</p>
                <button 
                  onClick={() => {setEditedUser(user); setIsEditingProfile(true);}}
                  style={{ backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none', padding: '6px 16px', borderRadius: '15px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item-btn ${activeTab === 'orders' ? 'active' : ''}`} 
              onClick={() => setActiveTab('orders')}
            >
              <span className="icon">🛍️</span> My Orders <span className="arrow">›</span>
            </button>
            
            <button 
              className={`nav-item-btn ${activeTab === 'wishlist' ? 'active' : ''}`} 
              onClick={() => setActiveTab('wishlist')}
            >
              <span className="icon">❤️</span> Wishlist <span className="arrow">›</span>
            </button>
            
            <div className="nav-divider"></div>
            
            <button 
              className={`nav-item-btn ${activeTab === 'address' ? 'active' : ''}`} 
              onClick={() => setActiveTab('address')}
            >
              <span className="icon">📍</span> Delivery Address <span className="arrow">›</span>
            </button>
            
            <button 
              className={`nav-item-btn ${activeTab === 'payment' ? 'active' : ''}`} 
              onClick={() => setActiveTab('payment')}
            >
              <span className="icon">💳</span> Payment Methods <span className="arrow">›</span>
            </button>
            
            <button 
              className="nav-item-btn signout-btn" 
              onClick={() => {
                localStorage.clear(); 
                window.location.hash = '/login'; 
                window.location.reload(); 
              }}
            >
              <span className="icon">🚪</span> Sign Out
            </button>
          </nav>
        </aside>

        <main className="account-main-content">
          
          {activeTab === 'wishlist' && (
            <div className="wishlist-tab-content">
              
              <div className="wishlist-header">
                <h2>Wishlist</h2>
                <div className="wishlist-actions">
                  <button className="action-btn share-btn" onClick={() => alert('Wishlist link copied!')}>
                    <span>🔄</span> Share
                  </button>
                  <button className="action-btn edit-btn" onClick={() => alert('Edit Mode enabled.')}>
                    <span>✏️</span> Edit
                  </button>
                </div>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="empty-wishlist-state">
                  <div className="emoji-box-icon">
                    <div className="yellow-box">
                      <div className="box-eyes"><span>•</span><span>•</span></div>
                      <div className="box-mouth"></div>
                    </div>
                  </div>
                  <h3>Ready to make a wish?</h3>
                  <p>Start adding items you love to your wishlist by tapping on the heart icon</p>
                  <span className="status-subtext">Status</span>
                </div>
              ) : (
                <div className="wishlist-products-grid">
                  {wishlistProducts.map(product => {
                    const isFav = isFavorite(product.id);
                    
                    // 🛠️ تظبيط مسار الصور للـ Wishlist بنفس المنطق الآمن
                    const cleanPath = (product.image || '').startsWith('/') ? product.image.substring(1) : product.image;
                    const imageSrc = product.image && (product.image.startsWith('http') || product.image.startsWith('data:'))
                      ? product.image
                      : `${import.meta.env.BASE_URL || '/'}${cleanPath}`;

                    return (
                      <Link to={`/services/${product.id}`} className="b2b-wish-card" key={product.id}>
                        <div className="wish-img-container">
                          <img 
                            src={imageSrc} 
                            alt={product.name} 
                            // 🛠️ استبدال البلايس هولدر برابط آمن
                            onError={(e) => { e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=IndusConnect'; }}
                          />
                          
                          <div className="wish-overlay-buttons">
                            <button 
                              className={`wish-circle-btn ${isFav ? 'active-fav' : ''}`} 
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                toggleFavorite(product); 
                              }}
                            >
                              {isFav ? '❤️' : '♡'}
                            </button>
                            
                            <button 
                              className="wish-circle-btn" 
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              🛒
                            </button>
                          </div>
                        </div>
                        
                        <div className="wish-card-info">
                          <span className="wish-cat-tag">{product.category}</span>
                          <h3 className="wish-prod-name">{product.name}</h3>
                          <p className="wish-prod-desc">{product.description || 'No description available.'}</p>
                          <div className="wish-prod-meta">
                            <span>👁️ {product.viewedCount || '10+'} viewed in past week</span>
                            <span className="wish-rating">⭐ {product.rating || 5} <small>({product.reviews || 0})</small></span>
                          </div>
                        </div>
                        
                        <div className="wish-card-footer">
                          <div className="wish-footer-col">
                            <span className="w-lbl">MOQ</span>
                            <span className="w-val">{product.moq || '10 Unit'}</span>
                          </div>
                          <div className="wish-footer-col w-highlight">
                            <span className="w-lbl">Unit Price</span>
                            <span className="w-val">{product.unitPrice || `${product.price}EGP`}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {activeTab === 'orders' && <div className="tab-placeholder"><h3>My Orders Content</h3></div>}
          {activeTab === 'address' && <div className="tab-placeholder"><h3>Delivery Address Content</h3></div>}
          {activeTab === 'payment' && <div className="tab-placeholder"><h3>Payment Methods Content</h3></div>}

        </main>
      </div>
    </div>
  )
}