import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFavorites } from '../App'; 
import './Services.css';

// ==========================================
// DEFAULT PRODUCTS DATA ARRAY
// ==========================================
export const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Modern Pendant Light', price: 600, category: 'Furniture', rating: 4, reviews: 100, image: 'product_amber_pendant.png', description: 'Modern lamp with a practical and artistic design.', viewedCount: '50+', moq: '20pcs', unitPrice: '700EGP' },
  { id: 2, name: 'Synthetic Leather', price: 30, category: 'Raw Material', rating: 2, reviews: 50, image: 'product_leather_chair_premium.png', description: 'Leather ideal for wallets and small accessories.', viewedCount: '20+', moq: '60pcs', unitPrice: '30EGP' },
  { id: 3, name: 'Cardboard Boxes', price: 10, category: 'Package', rating: 5, reviews: 50, image: 'product_agri_equipment.png', description: 'Strong boxes for safe packaging and delivery.', viewedCount: '70+', moq: '500pcs', unitPrice: '10EGP' },
  { id: 4, name: 'Solid Shelf Table', price: 1000, category: 'Furniture', rating: 5, reviews: 300, image: 'cat_furniture_shelf.png', description: 'Sleek wooden table with a functional shelf.', viewedCount: '200+', moq: '12pcs', unitPrice: '1000EGP' },
  { id: 5, name: 'Hoodies', price: 250, category: 'Textile', rating: 4, reviews: 100, image: 'cat_textile_hoodies.png', description: 'Comfortable hoodies suitable for casual wear.', viewedCount: '500+', moq: '50pcs', unitPrice: '250EGP' },
  { id: 6, name: 'PVC Rolls', price: 500, category: 'Raw Material', rating: 3, reviews: 400, image: 'cat_raw_pvc.png', description: 'High-quality PVC rolls for construction and packaging.', viewedCount: '400+', moq: '100pcs', unitPrice: '500EGP' },
  { id: 7, name: 'Industrial Drill', price: 850, category: 'Electronic & Spare Parts', rating: 4, reviews: 80, image: 'product_amber_pendant.png', description: 'High-performance drill for industrial use.', viewedCount: '150+', moq: '5pcs', unitPrice: '850EGP' },
  { id: 8, name: 'Cotton Fabric Roll', price: 120, category: 'Textile', rating: 5, reviews: 120, image: 'product_leather_chair_premium.png', description: 'Premium quality cotton fabric for garments.', viewedCount: '300+', moq: '100m', unitPrice: '120EGP' },
  { id: 9, name: 'Office Chair', price: 950, category: 'Furniture', rating: 4, reviews: 210, image: 'product_agri_equipment.png', description: 'Ergonomic chair for long working hours.', viewedCount: '400+', moq: '10pcs', unitPrice: '950EGP' },
];

const categoriesList = ['Textile', 'Raw Material', 'Furniture', 'Electronic & Spare Parts', 'Industrial suppliers', 'Food & Beverage Suppliers'];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentQuery, setCurrentQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMax, setPriceMax] = useState(50000); 
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);
  
  const productsPerPage = 9; 

  const { toggleFavorite, isFavorite } = useFavorites();

  const [allProducts, setAllProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('indus_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  });

  useEffect(() => {
    const syncProducts = () => {
      try {
        const saved = localStorage.getItem('indus_products');
        if (saved) setAllProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing products from local storage", e);
      }
    };

    window.addEventListener('storage', syncProducts);
    return () => window.removeEventListener('storage', syncProducts);
  }, []);

  useEffect(() => {
    const queryFromUrl = searchParams.get('search') || '';
    setCurrentQuery(queryFromUrl);
    setCurrentPage(1); 
    
    if (queryFromUrl.trim() !== '') {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceMax(50000); 
    setMinRating(0);
    setSort('Recommended');
    setCurrentPage(1);
    setCurrentQuery('');
    setSearchParams({});
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    try {
      const savedCart = localStorage.getItem('cart');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(cartItems)) cartItems = [];

      const existingIndex = cartItems.findIndex(item => item.id === product.id);

      if (existingIndex > -1) {
        cartItems[existingIndex].quantity = (cartItems[existingIndex].quantity || 1) + 1;
      } else {
        // 🛠️ دمج المسار بشكل صحيح لسلة المشتريات
        const formattedImage = product.image.startsWith('data:') || product.image.startsWith('http') 
          ? product.image 
          : `${import.meta.env.BASE_URL}${product.image.replace(/^\//, '')}`;
        
        cartItems.push({
          id: product.id,
          name: product.name,
          price: Number(product.price), 
          image: formattedImage,
          seller: 'IndusConnect Official', 
          quantity: 1 
        });
      }

      localStorage.setItem('cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Cart updating failed:", error);
    }
  };

  const filteredAndSorted = useMemo(() => {
    const approvedProducts = allProducts.filter(p => !p.status || p.status.toLowerCase() === 'approved');

    return approvedProducts.filter(p => {
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      
      const matchQ = !currentQuery || currentQuery.trim() === '' ||
        p.name.toLowerCase().includes(currentQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(currentQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(currentQuery.toLowerCase()));

      const matchPrice = Number(p.price) <= priceMax;
      const matchRating = minRating === 0 || p.rating >= minRating;
      
      return matchCat && matchQ && matchPrice && matchRating;
    }).sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price - b.price;
      if (sort === 'Newest') return b.id - a.id;
      return 0;
    });
  }, [allProducts, selectedCategories, priceMax, minRating, sort, currentQuery]);

  const totalPages = Math.ceil(filteredAndSorted.length / productsPerPage);

  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredAndSorted.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredAndSorted, currentPage, productsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById("products-grid-start");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="services-page-container">
      
      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section className="services-hero-section-new">
        <div className="container services-hero-flex">
          
          <div className="services-hero-text">
            <h1 className="services-hero-title">
              Discover trusted products from <br />
              <span className="highlight-verified">verified</span> suppliers
            </h1>
            <div className="services-hero-btns">
              <a href="#products-grid-start" className="services-btn-red">Shop Now</a>
              <a href="#products-grid-start" className="services-btn-outline">Read more</a>
            </div>
          </div>

          <div className="services-hero-graphic">
            <div className="services-shape-wrapper">
              <div className="services-abstract-line line-1"></div>
              <div className="services-abstract-line line-2"></div>
              <img 
                src={`${import.meta.env.BASE_URL}hero_men_warehouse.png`} 
                alt="Verified Products Layout" 
                className="services-display-img" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          2. MAIN CONTENT LAYOUT SECTION
          ========================================== */}
      <div className="services-content-layout container" id="products-grid-start">
        
        {/* Sidebar Filter Controls */}
        <aside className="filter-sidebar">
          <div className="filter-header-row">
            <h2 className="filter-title">Filter Options</h2>
            <button className="clear-link" onClick={clearFilters}>Clear all</button>
          </div>
          
          {/* Category Filter */}
          <div className="filter-section-v2">
            <h4>By Categories</h4>
            <div className="checkbox-list">
              {categoriesList.map(cat => (
                <label key={cat} className="custom-check">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)} 
                    onChange={() => {
                        setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
                        setCurrentPage(1); 
                    }} 
                  />
                  <span className="box"></span> {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section-v2">
            <h4>Price Range</h4>
            <p className="price-label">Up to: {Number(priceMax).toLocaleString()} EGP</p>
            <input 
              type="range" min="10" max="50000" step="50" value={priceMax} 
              onChange={(e) => {
                  setPriceMax(Number(e.target.value));
                  setCurrentPage(1);
              }} 
              className="price-range-input" 
            />
          </div>

          {/* Star Rating Filter */}
          <div className="filter-section-v2">
            <h4>Rating</h4>
            {[5, 4, 3, 2, 1].map(star => (
              <label key={star} className="custom-check star-row">
                <input 
                  type="checkbox" 
                  checked={minRating === star} 
                  onChange={() => { 
                    setMinRating(prev => prev === star ? 0 : star); 
                    setCurrentPage(1); 
                  }} 
                />
                <span className="box"></span>
                <span className="stars-gold">{'★'.repeat(star)}{'☆'.repeat(5-star)}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* ==========================================
            3. PRODUCTS DISPLAY MAIN AREA
            ========================================== */}
        <main className="products-main-area">
          
          {/* Top Utilities Bar */}
          <div className="top-bar-new">
            <Link to="/rfq" className="rfq-system-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>RFQ System</Link>
            <div className="sort-dropdown-new">
              <span>Sort By :</span>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}>
                <option value="Recommended">Recommended</option>
                <option value="Newest">Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Search Feedback Header */}
          {currentQuery && <p className="search-results-feedback">Showing results for: "<strong>{currentQuery}</strong>"</p>}

          {/* Products Dynamic Grid */}
          <div className="modern-products-grid">
            {currentProducts.map(product => {
              
              // 🛠️ التعديل الجذري لمسار الصورة مع الـ Base URL 
              const imageSrc = product.image.startsWith('data:') || product.image.startsWith('http')
                ? product.image
                : `${import.meta.env.BASE_URL}${product.image.replace(/^\//, '')}`;
                
              const isFav = isFavorite(product.id);
              
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
                      // 🛠️ استخدام Placeholder الآمن والسريع
                      onError={(e) => { e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=No+Image'; }}
                    />
                    
                    <div className="img-overlay-actions inline-icons">
                      <button 
                        className={`circle-icon fav-icon-btn ${isFav ? 'is-fav' : ''}`} 
                        onClick={(e) => {
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          toggleFavorite(product);
                        }} 
                      >
                        {isFav ? '❤️' : '♡'}
                      </button>
                      
                      <button 
                        className="circle-icon cart-icon-btn" 
                        onClick={(e) => handleAddToCart(e, product)} 
                      >
                        🛒 
                      </button>
                    </div>
                  </div>

                  <div className="card-info-v2">
                    <span className="cat-tag">{product.category}</span>
                    <h3 className="prod-name">{product.name}</h3>
                    <p className="prod-desc">{product.description || 'No description available.'}</p>
                    
                    <div className="view-stats">
                      <span className="eye-icon">👁</span> 
                      <span>{product.viewedCount || '10+'} viewed in past week</span>
                    </div>

                    <div className="rating-row">
                      <span className="star-icon">⭐</span>
                      <span className="rating-val">{product.rating}</span>
                      <span className="reviews-count">({product.reviews})</span>
                    </div>

                    <div className="card-separator"></div>

                    <div className="card-b2b-footer">
                      <div className="footer-item">
                        <div className="footer-icon">📦</div>
                        <div className="footer-text">
                          <div className="label">MOQ</div>
                          <div className="value">{product.moq}</div>
                        </div>
                      </div>
                      
                      <div className="footer-divider"></div>
                      
                      <div className="footer-item">
                        <div className="footer-icon red-tag">🏷️</div>
                        <div className="footer-text">
                          <div className="label">Unit Price</div>
                          <div className="value">{product.unitPrice || `${Number(product.price).toLocaleString()} EGP`}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Fallback UI */}
            {currentProducts.length === 0 && (
              <div className="no-products-found">
                <p>No products match your search or filter criteria.</p>
                <button className="clear-link" onClick={clearFilters}>Reset Filters</button>
              </div>
            )}
          </div>

          {/* ==========================================
              4. PAGINATION NAVIGATION CONTROLS
              ========================================== */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                disabled={currentPage === 1} 
                onClick={() => handlePageChange(currentPage - 1)}
                className="page-btn"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages} 
                onClick={() => handlePageChange(currentPage + 1)}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}