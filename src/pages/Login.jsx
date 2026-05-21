import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

// ==========================================
// AUTHENTICATION COMPONENT (LOGIN)
// ==========================================
export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const usernameInput = form.username.trim().toLowerCase();


    if (usernameInput === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      
      
      window.dispatchEvent(new Event('storage'));
      
      navigate('/admin', { replace: true });
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      
      
      window.dispatchEvent(new Event('storage'));
      
      
      navigate('/home', { replace: true });
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* ==========================================
            1. AUTHENTICATION FORM CONTROLS PANEL
            ========================================== */}
        <div className="auth-form-section">
          <div className="brand-logo">
              {/* Dynamic context injection deployment mapping for GitHub absolute path structures */}
            <img src={`${import.meta.env.BASE_URL}icons.svg`} alt="Logo" />
          </div>

          <h1 className="welcome-text">Welcome back!</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Input Field */}
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
            
            {/* Password Input Field with Interactive Visibility Toggles */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
              <span className="eye-icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
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

            {/* Remember Me checkbox and Forgotten Account Link triggers */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> 
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password">Forget password ?</Link>
            </div>

            <button type="submit" className="login-btn">Login</button>
            <Link to="/signup" className="signup-link">Sign Up</Link>
          </form>

          {/* Graphical Divider Line */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* Social Authentication Access Points */}
          <div className="social-login">
            <button className="social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
            </button>
            <button className="social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" />
            </button>
            <button className="social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
            </button>
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
    </div>
  )
}