import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites, useCart } from '../App'; // 🛠️ تم إضافة useCart هنا
import { DEFAULT_PRODUCTS } from './Services'; 
import './Favorites.css'; 

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart(); // 🛠️ جلب دالة إضافة المنتجات للسلة

  const favoriteProducts = DEFAULT_PRODUCTS.filter(p => favorites.includes(p.id));

  // دالة معالجة مسارات الصور
  const getSafeImageSrc = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;

    const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
      ? import.meta.env.BASE_URL 
      : `${import.meta.env.BASE_URL}/`;
      
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className="favorites-page-container">
      <div className="favorites-container">
        
        <div className="favorites-header">
          <div>
            <h1>My Wishlist</h1>
            <p>You have saved {favoriteProducts.length} items</p>
          </div>
          <Link to="/services" className="favorites-btn">Back to Shop</Link>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="favorites-empty-state">
            <div className="favorites-empty-icon">❤️</div>
            <h3>Your Wishlist is Empty</h3>
            <p>Tap the heart icon on products to save them here.</p>
            <Link to="/services" className="favorites-btn favorites-btn-accent">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="modern-products-grid">
            {favoriteProducts.map(product => {
              const imageSrc = getSafeImageSrc(product.image);
              
              return (
                <Link 
                  to={`/services/${product.id}`} 
                  className="b2b-product-card" 
                  key={product.id} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card-img-container">
                    <img 
                      src={imageSrc} 
                      alt={product.name} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found'; }}
                    />
                    
                    {/* الأزرار فوق الصورة */}
                    <div className="img-overlay-actions inline-icons" style={{ opacity: 1 }}>
                      {/* زر الحذف من المفضلة */}
                      <button 
                        className="circle-icon fav-icon-btn" 
                        onClick={(e) => {
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          toggleFavorite(product);
                        }} 
                      >
                        ❤️
                      </button>

                      {/* 🛠️ زر إضافة المنتج إلى السلة */}
                      <button 
                        className="circle-icon cart-icon-btn" 
                        onClick={(e) => {
                          e.preventDefault(); // منع الانتقال لصفحة التفاصيل
                          e.stopPropagation(); // منع انتشار الحدث لملف الـ Link
                          addToCart(product); // إضافة المنتج
                        }} 
                      >
                        🛒
                      </button>
                    </div>
                  </div>

                  <div className="card-info-v2">
                    <span className="cat-tag">{product.category || 'Product'}</span>
                    <h3 className="prod-name">{product.name}</h3>
                    <p className="prod-desc">{product.description || 'No description available.'}</p>
                    
                    <div className="rating-row">
                      <span className="star-icon">⭐</span>
                      <span className="rating-val">{product.rating || 'N/A'}</span>
                    </div>

                    <div className="card-separator"></div>

                    <div className="card-b2b-footer">
                      <div className="footer-item">
                        <div className="footer-icon">📦</div>
                        <div className="footer-text">
                          <div className="label">MOQ</div>
                          <div className="value">{product.moq || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="footer-divider"></div>
                      <div className="footer-item">
                        <div className="footer-icon red-tag">🏷️</div>
                        <div className="footer-text">
                          <div className="label">Unit Price</div>
                          <div className="value">{product.unitPrice || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}