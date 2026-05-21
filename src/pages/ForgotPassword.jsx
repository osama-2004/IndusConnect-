
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css' 
import logoImg from '../assets/logo.svg' 

export function ForgotPassword() {
  const [step, setStep] = useState('email'); 
  const [email, setEmail] = useState('nourhan19@gmail.com'); 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(59);

  // States للتحكم في إظهار وإخفاء كلمات المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setStep('otp');
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ''); 
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (element.nextSibling && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.every(slot => slot !== '')) {
      setStep('new-password');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && password.length >= 6) {
      alert("Password Reset Successfully!");
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: 'Weak', class: 'weak' };
    if (password.length < 6) return { text: 'Weak', class: 'weak' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { text: 'Strong', class: 'strong' };
    }
    return { text: 'Medium', class: 'medium' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="reset-page-wrapper">
      
      <div className="reset-logo-area">
        <img src={logoImg} alt="IndusConnect" onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=IndusConnect'} />
      </div>

      <div className="reset-header-text">
        <h2>Reset Your Password</h2>
        <p>Enter the OTP sent to your email to rest your password.</p>
      </div>

      <div className="reset-cards-layout">
        
        {step === 'email' && (
          <div className="reset-card">
            <div className="card-title-row">
              <div className="icon-badge email-icon-badge">✉️</div>
              <div>
                <h3>Find Your Account</h3>
                <p>Please enter your email address to search for your account.</p>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="reset-form-box">
              <div className="reset-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="reset-action-btn">Continue</button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="reset-card">
            <div className="card-title-row">
              <div className="icon-badge email-icon-badge">✉️</div>
              <div>
                <h3>Verify Your Email</h3>
                <p>Enter the 6-digit OTP code we sent to <span className="highlight-email">{email}</span></p>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="reset-form-box">
              <div className="otp-inputs-row">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    ref={(el) => (otpRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>

              <div className="resend-code-text">
                Didn't receive the code ? {' '}
                {timer > 0 ? (
                  <span className="timer-countdown">Resend code (00:{timer < 10 ? `0${timer}` : timer})</span>
                ) : (
                  <button type="button" className="resend-link-btn" onClick={() => setTimer(59)}>Resend code</button>
                )}
              </div>

              <button type="submit" className="reset-action-btn" disabled={otp.some(slot => slot === '')}>
                Verify OTP
              </button>
            </form>
          </div>
        )}

        {step === 'new-password' && (
          <div className="reset-card">
            <div className="card-title-row">
              <div className="icon-badge lock-icon-badge">🔒</div>
              <div>
                <h3>Create New Password</h3>
                <p>Your new password must be different from previous used passwords.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="reset-form-box">
              <div className="reset-input-group" style={{ position: 'relative' }}>
                <label>New Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={showPassword ? "Enter new password (Hide)" : "Enter new password (Show)"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
          
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ position: 'absolute', right: '15px', top: '38px', fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer', fontWeight: '500', userSelect: 'none' }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <div className="strength-bar-wrapper">
                <div className={`bar-segment ${password.length >= 1 ? strength.class : ''}`}></div>
                <div className={`bar-segment ${password.length >= 4 && strength.class !== 'weak' ? strength.class : ''}`}></div>
                <div className={`bar-segment ${password.length >= 7 && strength.class === 'strong' ? strength.class : ''}`}></div>
              </div>
              <span className={`strength-label-text ${strength.class}`}>Password strength: {strength.text}</span>

              <div className="reset-input-group" style={{ marginTop: '20px', position: 'relative' }}>
                <label>Confirm New Password</label>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder={showConfirmPassword ? "Re-enter new password " : "Re-enter new password "} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={{ position: 'absolute', right: '15px', top: '38px', fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer', fontWeight: '500', userSelect: 'none' }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>

              <button type="submit" className="reset-action-btn" style={{ marginTop: '30px' }}>
                Update Password
              </button>

              <div className="reset-footer-links">
                Remember your password ? <Link to="/login">Back to login</Link>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}