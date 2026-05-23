import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFavorites } from '../App'; // 🛠️ الحفاظ على استدعاء المفضلة
import './ServiceDetail.css'

// ============================================================================
// HELPER UTILITY: RESOLVE PUBLIC IMAGE PATHS
// ============================================================================
// Resolves dynamic image source paths correctly for local and live environments
const getProductImage = (imageName) => {
  if (!imageName) return 'https://via.placeholder.com/300?text=IndusConnect';
  if (imageName.startsWith('data:') || imageName.startsWith('http')) return imageName;
  
  // Clean forward slash if exists to prevent duplicate token rendering errors
  const cleanPath = imageName.startsWith('/') ? imageName.substring(1) : imageName;
  
  // Dynamically attach GitHub Pages base path configuration parameters
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

// ============================================================================
// DATA REFERENCE: DEFAULT PRODUCTS FALLBACK ARRAY
// ============================================================================
// Core repository placeholder when external state management keys are initialized empty
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Modern Pendant Light', price: 600, category: 'Furniture', rating: 4, reviews: 100, image: 'product_amber_pendant.png', description: 'Modern lamp with a practical and artistic design.', seller: 'Beit el ezz' },
  { id: 2, name: 'Synthetic Leather', price: 30, category: 'Raw Material', rating: 2, reviews: 50, image: 'product_leather_chair_premium.png', description: 'Leather ideal for wallets and small accessories.', seller: 'Beit el ezz' },
  { id: 3, name: 'Cardboard Boxes', price: 10, category: 'Package', rating: 5, reviews: 50, image: 'product_agri_equipment.png', description: 'Strong boxes for safe packaging and delivery.', seller: 'Beit el ezz' },
  { id: 4, name: 'Solid Shelf Table', price: 1000, category: 'Furniture', rating: 5, reviews: 300, image: 'cat_furniture_shelf.png', description: 'Sleek wooden table with a functional shelf.', seller: 'Beit el ezz' },
  { id: 5, name: 'Hoodies', price: 250, category: 'Textile', rating: 4, reviews: 100, image: 'cat_textile_hoodies.png', description: 'Comfortable hoodies suitable for casual wear.', seller: 'Beit el ezz' },
  { id: 6, name: 'PVC Rolls', price: 500, category: 'Raw Material', rating: 3, reviews: 400, image: 'cat_raw_pvc.png', description: 'Flexible PVC rolls used for industrial applications.', seller: 'Beit el ezz' }
];

// ============================================================================
// SUB-COMPONENT: STAR RATING RENDER ENGINE
// ============================================================================
// Handles evaluation stars rendering configurations along with customer totals text
const StarRating = ({ rating, totalReviews }) => (
  <div className="star-rating-container">
    <div className="stars-gold">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? "star-filled" : "star-empty"}>★</span>
      ))}
    </div>
    <span className="reviews-count-text">{rating} ({totalReviews} Reviews)</span>
  </div>
);

// ============================================================================
// MAIN COMPONENT: SERVICE DETAIL OPERATIONS WINDOW
// ============================================================================
export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🛠️ الحفاظ على تفعيل المفضلة
  const { toggleFavorite, isFavorite } = useFavorites();

  // Local state hook reflecting dynamic updates derived from localStorage keys
  const [liveProducts, setLiveProducts] = useState(() => {
    const saved = localStorage.getItem('indus_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  // Effect sync tracking storage parameter modifications across decoupled system interfaces
  useEffect(() => {
    const syncLiveProducts = () => {
      const saved = localStorage.getItem('indus_products');
      if (saved) setLiveProducts(JSON.parse(saved));
    };
    window.addEventListener('storage', syncLiveProducts);
    return () => window.removeEventListener('storage', syncLiveProducts);
  }, []);

  // Strict targeted matching calculation query mapping parameters directly to string format structures
  const product = liveProducts.find(p => p.id.toString() === id.toString()) || liveProducts[0];
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [qty, setQty] = useState(1); 
  const [visibleReviews, setVisibleReviews] = useState(3);
  
  // 🛠️ التحقق هل المنتج في المفضلة
  const isFav = isFavorite(product.id);

  // Hardcoded evaluation contextual mock dataset parameters
  const reviewsData = [
    { id: 1, name: 'Laila Hassan', stars: 4, text: 'Excellent quality, exactly as described.', img: 'https://i.pravatar.cc/100?u=1' },
    { id: 2, name: 'Nour Yehia', stars: 3, text: 'Durable and perfect for our projects.', img: 'https://i.pravatar.cc/100?u=2' },
    { id: 3, name: 'Zain Adam', stars: 5, text: 'Meet all our specifications, highly recommended.', img: 'https://i.pravatar.cc/100?u=3' },
    { id: 4, name: 'Omar Ali', stars: 5, text: 'Fantastic piece of art!', img: 'https://i.pravatar.cc/100?u=4' },
  ];

  // Dispatches state data matrices directly into client shopping cart context arrays
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: getProductImage(product.image || product.images?.[0]), 
      seller: product.seller || 'IndusConnect Official'
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += qty;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated')); 
    navigate('/cart');
  };

  // Triggers viewport layout focus vectors directly towards secondary panel modules
  const scrollToReviews = () => {
    setActiveTab('reviews');
    document.getElementById('tabs-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      
      {/* ======================================================================
          SECTION 1: MAIN PRODUCT DETAILS SPLIT CARD PRESENTATION VIEW
          ====================================================================== */}
      <div className="detail-card-main">
        
        {/* Left Column Aspect Frame: Dynamic Product Media Viewport Wrapper */}
        <div className="image-column">
          {/* 🛠️ تعديل: إزالة مقاسات حاوية الصورة وتوسيط المحتوى. الإبقاء فقط على الموضع النسبي لاستقرار القلب */}
          <div className="main-image-holder" style={{cursor: 'pointer', position: 'relative'}}>
            {/* 🛠️ الحفاظ على زر المفضلة ومنطقه البرمجي. تنظيف الـ Inline Styles المنسقة */}
            <button 
              className={`heart-icon-btn ${isFav ? 'active-fav' : ''}`}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                zIndex: 10,
                color: isFav ? '#c24438' : '#999'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product);
              }}
            >
              {isFav ? '❤️' : '♡'}
            </button>
            
            {/* 🛠️ تعديل: إزالة الـ Inline Styles الخاصة بمقاسات الصورة (width/height/objectFit) لتعود لشكلها الأصلي */}
            <img 
              src={getProductImage(product.image || product.images?.[0])} 
              alt={product.name} 
              className="img-fluid" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=IndusConnect'; }}
            />
          </div>
        </div>

        {/* Right Column Aspect Frame: Commercial Typography & Specifications */}
        <div className="info-column">
          <nav className="category-path">{product.category}</nav>
          <h1 className="main-product-title">{product.name}</h1>
          
          <StarRating rating={product.rating || 5} totalReviews={product.reviews || 0} />
          
          <div className="price-display">EGP {Number(product.price).toLocaleString()}</div>

          {/* Context Block: Main Description Statement Container */}
          <section className="description-block">
            <h3>What is it ?</h3>
            <p>{product.description || 'Premium industrial grade product listed on IndusConnect.'}</p>
          </section>

          {/* Context Block: Technical/Commercial Advantages Enumeration Bullet List */}
          <section className="special-block">
            <h3>Why is it special ?</h3>
            <ul>
              <li>Eco-friendly</li>
              <li>Customizable</li>
              <li>Trendy & Functional</li>
            </ul>
          </section>

          {/* Action Row Component: Dynamic Order Controllers (Quantity counters, CART, RFQ buttons) */}
          <div className="action-row">
            <div className="qty-selector">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn-add-cart" onClick={handleAddToCart}>Add to cart</button>
            <button className="btn-rfq" onClick={() => navigate('/rfq')}>RFQ</button>
          </div>
        </div>
      </div>

      {/* ======================================================================
          SECTION 2: SELLER METRICS & AUTHENTICATION BADGING STRIP BANNER
          ====================================================================== */}
      <div className="seller-info-strip">
        <div className="seller-profile" onClick={scrollToReviews} style={{cursor: 'pointer'}}>
          <div className="avatar-circle">👤</div>
          <p>Sold by <strong style={{textDecoration: 'underline'}}>{product.seller || 'IndusConnect Official'}</strong></p>
          <span className="rating-tag">⭐ 4.8 ({reviewsData.length} Reviews)</span>
        </div>
      </div>

      {/* ======================================================================
          SECTION 3: LEGAL TRUST ASSURANCE BADGES CONTEXTUAL Bannered GRID
          ====================================================================== */}
      <div className="trust-badges-grid">
        <div className="badge-item"><span>🚚</span><p>Fast Shipping</p></div>
        <div className="badge-item"><span>💰</span><p>Cash on Delivery</p></div>
        <div className="badge-item"><span>🏅</span><p>100% Premium quality</p></div>
        <div className="badge-item"><span>🛡️</span><p>Payment Protection</p></div>
      </div>

      {/* ======================================================================
          SECTION 4: INTERACTIVE TAB PANELS HOUSING USER REVIEW PANELS & DEALS MOCK SAMPLES
          ====================================================================== */}
      <div className="tabs-system" id="tabs-section">
        {/* Navigation header controls for managing contextual switch renders */}
        <div className="tabs-nav">
          <button className={activeTab === 'reviews' ? 'tab-link active' : 'tab-link'} onClick={() => setActiveTab('reviews')}>Reviews</button>
          <button className={activeTab === 'sample' ? 'tab-link active' : 'tab-link'} onClick={() => setActiveTab('sample')}>Sample Request</button>
        </div>

        {/* Tab content wrapper running conditional processing loops */}
        <div className="tab-body">
          {activeTab === 'reviews' ? (
            
            /* Sub-Panel Content Block Module: Client Feedback Lists Viewport */
            <div className="reviews-list-area">
              <div className="list-header">
                <h4 style={{color: '#c24438'}}>Review List</h4>
                <select className="sort-box"><option>Sort By: Newest</option></select>
              </div>

              {/* Dynamic rendering looping through current active arrays */}
              {reviewsData.slice(0, visibleReviews).map(rev => (
                <div key={rev.id} className="single-review">
                  <img src={rev.img} alt="user" className="user-avatar-img" />
                  <div className="review-content">
                    <div className="review-top-line">
                      <h5>{rev.name}</h5>
                      <div className="mini-stars">{'★'.repeat(rev.stars)}{'☆'.repeat(5-rev.stars)}</div>
                    </div>
                    <p className="review-text">{rev.text}</p>
                  </div>
                </div>
              ))}
              
              {/* Incremental visual truncation load more pagination buttons trigger */}
              {visibleReviews < reviewsData.length && (
                <button className="btn-more-red" onClick={() => setVisibleReviews(prev => prev + 2)}>More Reviews ↓</button>
              )}
            </div>
          ) : (
            
            /* Sub-Panel Content Block Module: Corporate Sample Request forms panel fallback */
            <div className="sample-request-area">
              <p>Sample request content goes here...</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}