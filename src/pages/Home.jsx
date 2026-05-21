import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Heart, Gauge, Lightbulb, Users } from 'lucide-react';
// ==========================================
// DATA ARCHITECTURE: PARTNERS & REVIEWS FALLBACKS
// ==========================================
const partners = [
  { name: 'Bosch', logo: 'logo_industrial_2.png' },
  { name: 'Caterpillar', logo: 'logo_industrial_3.png' },
  { name: 'ABB Group', logo: 'logo_industrial_1.png' },
  { name: 'Honeywell', logo: 'logo_industrial_2.png' },
];

const initialReviews = [
  { id: 1, name: 'Sami Mansour', role: 'Buyer', rating: 4, text: 'I found reliable suppliers much faster than before. The process was smooth and saved me a lot of time.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { id: 2, name: 'Nour El-Din', role: 'Supplier', rating: 5, text: 'IndusConnect helped me reach new clients managing deals and communication became much easier.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: 3, name: 'Omar Khaled', role: 'General Manager', rating: 4, text: 'A practical platform that makes business connections simple and trustworthy. It really simplifies the process.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
];

// Sub-Component: Star Evaluation Mapping Rendering Engine
const StarRating = ({ rating }) => (
  <div className="star-rating">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'star--filled' : ''}`}>★</span>
    ))}
  </div>
);

// ==========================================
// CORE UI COMPONENT: LANDING HOMEPAGE INTERFACE
// ==========================================
function Home() {
  const [allReviews, setAllReviews] = useState(initialReviews);
  const [showMore, setShowMore] = useState(true);

  const handleMoreReviews = () => {
    const extraReviews = [
      { id: 4, name: 'Laila Ahmed', role: 'Manufacturer', rating: 5, text: 'Excellent platform for scaling production and finding quality raw materials.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { id: 5, name: 'Zaid Ali', role: 'Trader', rating: 4, text: 'The networking tools are top-notch. Highly recommended for B2B deals.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    ];
    setAllReviews([...initialReviews, ...extraReviews]);
    setShowMore(false);
  };

  return (
    <div className="home-container">
      
      {/* ======================================================================
          SECTION 1: HERO LANDING VIEWPORT PRESENTATION (MATCHING TARGET DESIGN)
          ====================================================================== */}
      <section className="hero-section-new">
        <div className="container hero-flex-layout">
          
          {/* Left Anchor Frame: Corporate Typography & Call-To-Actions Buttons */}
          <div className="hero-text-content">
            <h1 className="hero-title-main">
              All Suppliers, Traders &amp; Manufacturers <br /> in One Place.
            </h1>
            <p className="hero-description-text">
              Find the right supplier, get the best price, and manage your orders.
            </p>
            <div className="hero-action-btns">
              <Link to="/services" className="btn-filled-red" style={{ textDecoration: 'none' }}>Shop Now</Link>
              <a href="#our-story" className="btn-outline-dark" style={{ textDecoration: 'none' }}>Read more</a>
            </div>
          </div>

          {/* Right Anchor Frame: Abstract Overlaid Circle Rings Graphic Illustration */}
          <div className="hero-graphic-display">
            <div className="image-and-shape-wrapper">
              {/* Overlaid Vectorized Outline Border Ring */}
              <div className="red-outline-shape"></div>
              {/* 🛠️ CRITICAL IMAGE ROUTE FIXED USING BASE_URL CONFIGURATIONS FOR GITHUB PAGES */}
              <img 
                src={`${import.meta.env.BASE_URL}hero_men_warehouse.png`} 
                alt="Boxes and Order Checklist Presentation Layout" 
                className="hero-main-image" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=IndusConnect+Hero'; }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================================
          SECTION 2: CORPORATE PROFILE PRESENTATION MODULE (OUR STORY)
          ====================================================================== */}
      <section className="story-section" id="our-story">
        <div className="container story-flex">
          <div className="story-img-box">
            {/* 🛠️ Dynamic Base URL safe pathways for secondary visuals rendering */}
            <img 
              src={`${import.meta.env.BASE_URL}story_handshake.png`} 
              alt="IndusConnect Corporate Partnership Trust Handshake" 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=IndusConnect+Story'; }}
            />
          </div>
          <div className="story-content">
            <h2>Our Story</h2>
            <p>IndusConnect is a B2B platform connecting startups, manufacturers, suppliers, and traders in one trusted network.</p>
          </div>
        </div>
      </section>
      

      {/* ======================================================================
          SECTION 1: FEATURES AND BENEFITS PRESENTATION MODULE
          ====================================================================== */}
          <section className="features-section" style={{ padding: '60px 0', backgroundColor: '#fff' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto',height: '264px',width: '100%' }}>
                <h2 className="section-header" style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2rem', color: '#1a2b3c' }}>
                  What we Have
                </h2>
    
              <div className="features-grid" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  gap: '40px', 
                  flexWrap: 'wrap',
                  textAlign: 'center' 
                }}>
      
               {/* 1. Verified */}
              <div className="feature-item" style={{ flex: '1', minWidth: '200px' }}>
              <Heart size={40} strokeWidth={1.5} color="#b91c1c" style={{ marginBottom: '15px', marginInline: 'auto' }} />
                <p style={{ fontWeight: '500', color: '#333', maxWidth: '200px', marginInline: 'auto' }}>Verified businesses and transparent transactions</p>
              </div>

              {/* 2. Speed */}
            <div className="feature-item" style={{ flex: '1', minWidth: '200px' }}>
              <Gauge size={40} strokeWidth={1.5} color="#b91c1c" style={{ marginBottom: '15px', marginInline: 'auto' }} />
                <p style={{ fontWeight: '500', color: '#333', maxWidth: '200px', marginInline: 'auto' }}>Find the right partner in minutes, not weeks</p>
            </div>

              {/* 3. Smart */}
            <div className="feature-item" style={{ flex: '1', minWidth: '200px' }}> 
              <Lightbulb size={40} strokeWidth={1.5} color="#b91c1c" style={{ marginBottom: '15px', marginInline: 'auto' }} />
                <p style={{ fontWeight: '500', color: '#333', maxWidth: '200px', marginInline: 'auto' }}>Smart connections tailored to your business needs</p>
            </div>

              {/* 4. Partners */}
            <div className="feature-item" style={{ flex: '1', minWidth: '200px' }}>
              <Users size={40} strokeWidth={1.5} color="#b91c1c" style={{ marginBottom: '15px', marginInline: 'auto' }} />
                <p style={{ fontWeight: '500', color: '#333', maxWidth: '200px', marginInline: 'auto' }}>Build partnerships that scale with you</p>
            </div>

            </div>
           </div>
         </section>

      {/* ======================================================================
          SECTION 3: METRICS TRACKING AND REPUTATION METRICS STRIP BANNER
          ====================================================================== */}
      <section className="trust-section">
        <h2 className="section-header">Built on Trust</h2>
        <div className="trust-stats-bar">
          <div className="container stats-flex">
            <div className="stat-unit"><h3>3 k +</h3><p>Buyers</p></div>
            <div className="stat-unit"><h3>11 k +</h3><p>Suppliers</p></div>
            <div className="stat-unit"><h3>20 k +</h3><p>Manufacture</p></div>
            <div className="stat-unit"><h3>500 +</h3><p>Startups</p></div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4: CUSTOMER SATISFACTION EVALUATION FEEDS (CLIENT FEEDBACKS)
          ====================================================================== */}
      <section className="clients-section">
        <div className="container">
          <h2 className="section-header">Satisfied Clients Speaks</h2>
          <div className="clients-grid">
            {allReviews.map((rev) => (
              <div key={rev.id} className="split-review-card">
                <div className="rev-side-profile">
                  <img src={rev.avatar} alt={rev.name} className="client-avatar" />
                  <p className="rev-name">{rev.name}</p>
                  <StarRating rating={rev.rating} />
                </div>
                <div className="rev-content-bubble">
                  <span className="quote-mark">“</span>
                  <h4 className="rev-role">{rev.role}</h4>
                  <p className="rev-text">{rev.text}</p>
                </div>
              </div>
            ))}
          </div>
          {showMore && (
            <div className="more-rev-wrapper">
              <button className="btn-more-reviews" onClick={handleMoreReviews}>More Reviews ↓</button>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================================
          SECTION 5: INTEGRATED VENDOR COLLABORATION LOGOTYPES FEED MARQUEE
          ====================================================================== */}
      <section className="partners-section">
        <div className="container partners-main-container">
          <h2 className="section-header">Collaboration and Partners</h2>
          <div className="partners-logos">
            {partners.map((partner, index) => {
              // 🛠️ Asset parsing injection layout pipeline mapping
              const partnerImgSrc = `${import.meta.env.BASE_URL}${partner.logo}`;
              return (
                <div key={index} className="partner-logo-item">
                  <img 
                    src={partnerImgSrc} 
                    alt={partner.name} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/120x40?text=Partner'; }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;