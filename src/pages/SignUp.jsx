import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

// ==========================================
// REGISTRATION COMPONENT (SIGN UP)
// ==========================================
export default function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'Buyer', terms: false })
  const [showPassword, setShowPassword] = useState(false) 
  const [showTerms, setShowTerms] = useState(false) 
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!form.terms) return alert("Please accept the terms")
    
    // Inject secure localized session keys safely into browser storage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', form.role.toLowerCase()); 
    
    // 🛠️ CRITICAL FIX: Force immediate storage event dispatching so App.jsx catches the updates before routing
    window.dispatchEvent(new Event('storage'));
    
    // 🛠️ Redirecting vectors explicitly towards the newly established standard home page
    navigate('/home', { replace: true });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* ==========================================
            1. REGISTRATION FORM SELECTION SECTION
            ========================================== */}
        <div className="auth-form-section">
          <div className="brand-logo">
            {/* 🛠️ Configured to fetch from public folder utilizing Base URL structures */}
            <img src={`${import.meta.env.BASE_URL}icons.svg`} alt="Logo" />
          </div>

          <h1 className="welcome-text">Create an account</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Entry view */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                required
              />
            </div>
            
            {/* Email Registration entry field */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>

            {/* Password Input Group control triggers */}
            <div className="input-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
              <span className="eye-icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer', position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </span>
            </div>

            {/* Account Role Privilege Selectors */}
            <div className="role-container">
              <span className="role-label">Role :</span>
              <div className="role-options">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="role" 
                    value="Buyer" 
                    checked={form.role === 'Buyer'} 
                    onChange={e => setForm({...form, role: e.target.value})}
                  /> 
                  <span>Buyer</span>
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="role" 
                    value="Supplier" 
                    checked={form.role === 'Supplier'} 
                    onChange={e => setForm({...form, role: e.target.value})}
                  /> 
                  <span>Supplier</span>
                </label>
              </div>
            </div>

            {/* Legal terms Acceptance inputs */}
            <div className="terms-container">
              <input 
                type="checkbox" 
                checked={form.terms} 
                onChange={e => setForm({...form, terms: e.target.checked})}
                id="terms"
              />
              <label htmlFor="terms">
                I agree to <span className="terms-link" onClick={() => setShowTerms(true)}>Terms & Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className="login-btn">Sign Up</button>
          </form>

          {/* Social login option interfaces separator */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* Federated Identity Provider anchors */}
          <div className="social-login">
            <button className="social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" className="social-icon-white" />
            </button>
            <button className="social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" className="social-icon-white" />
            </button>
            <button className="social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" className="social-icon-white" />
            </button>
          </div>

          {/* Alternative login routing viewport links */}
          <div className="auth-footer">
            {/* 🛠️ Fixed navigation path link to point to standard independent /login route */}
            Already have an account? <Link to="/login" className="login-link-red">Login</Link>
          </div>
        </div>

        {/* ==========================================
            2. DECORATIVE SIDE MEDIA PRESENTATION PANEL
            ========================================== */}
        <div className="auth-image-section">
          <div className="image-wrapper">
             {/* Dynamic context injection deployment mapping for GitHub absolute path structures */}
             <img src={`${import.meta.env.BASE_URL}hero_men_warehouse..png`} alt="Business warehouse" />
          </div>
        </div>

      </div>

      {/* ==========================================
          3. LEGAL MODAL COMPONENT WINDOW OVERLAY
          ========================================== */}
      {showTerms && (
        <div className="modal-overlay">
          <div className="terms-modal">
            <button className="close-modal" onClick={() => setShowTerms(false)}>&times;</button>
            <h2>Terms & Privacy Policy</h2>
            
            <div className="modal-content">
              <h3>Terms</h3>
              <p>By using IndusConnect, you agree to use the platform responsibly and provide accurate information. The platform connects buyer, suppliers and manufacturers but is not responsible for transactions between users. We may apply a commission on completed deals. We reserve the right to suspend any account that violates our policies.</p>
              
              <h3>Privacy Policy</h3>
              <p>We collect basic user information such as name, email and business details to improve our services. Your data is kept secure and will not be shared with third parties without your consent, except when required to operate the platform. By using IndusConnect, you agree to our data practices.</p>
            </div>

            <button className="accept-btn" onClick={() => { setForm({...form, terms: true}); setShowTerms(false); }}>
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  )
}