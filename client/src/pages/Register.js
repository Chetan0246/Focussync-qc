import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const cardRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Password strength checker
  useEffect(() => {
    const pwd = formData.password;
    setPasswordChecks({
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    });
  }, [formData.password]);

  const getPasswordStrength = () => {
    const score = Object.values(passwordChecks).filter(Boolean).length;
    if (score === 0) return { label: '', percent: 0, color: '' };
    if (score <= 1) return { label: 'Very Weak', percent: 20, color: '#ef4444' };
    if (score === 2) return { label: 'Weak', percent: 40, color: '#f59e0b' };
    if (score === 3) return { label: 'Fair', percent: 60, color: '#eab308' };
    if (score === 4) return { label: 'Strong', percent: 80, color: '#22c55e' };
    return { label: 'Very Strong', percent: 100, color: '#16a34a' };
  };

  const passwordStrength = getPasswordStrength();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (!passwordChecks.length) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword(prev => !prev);
    else setShowConfirmPassword(prev => !prev);
  };

  const checkIcon = (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );

  return (
    <div className="auth-page">
      {/* Animated Background Particles */}
      <div className="auth-bg-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="auth-bg-shapes">
        <div className="shape shape-circle" />
        <div className="shape shape-square" />
        <div className="shape shape-triangle" />
        <div className="shape shape-ring" />
        <div className="shape shape-dots" />
      </div>

      <div className="auth-container" ref={cardRef}>
        {/* Card Glow Effect */}
        <div
          className="auth-card-glow"
          style={{
            background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent)`,
          }}
        />

        <div className={`auth-card register-card ${mounted ? 'mounted' : ''}`}>
          {/* Animated Top Border */}
          <div className="auth-card-border register-border" />

          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🚀</span>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Start your journey to peak productivity</p>
          </div>

          {/* Social Signup Buttons */}
          <div className="social-login">
            <button type="button" className="social-btn google" aria-label="Sign up with Google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="social-btn github" aria-label="Sign up with GitHub">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or register with email</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message shake">
              <svg className="error-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>{error}</span>
              <button className="error-close" onClick={() => setError('')} aria-label="Dismiss error">×</button>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form register-form" noValidate>
            {/* Username */}
            <div className={`form-group ${focusedField === 'username' ? 'focused' : ''} ${formData.username ? 'filled' : ''}`}>
              <label className="form-label" htmlFor="reg-username">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                name="username"
                className="form-input"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={3}
                maxLength={20}
                autoComplete="username"
              />
              <div className="input-focus-effect" />
              {formData.username && (
                <span className="field-status">
                  {formData.username.length >= 3 ? '✓' : '✗'} {formData.username.length}/20
                </span>
              )}
            </div>

            {/* Email */}
            <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
              <label className="form-label" htmlFor="reg-email">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="email"
              />
              <div className="input-focus-effect" />
            </div>

            {/* Password */}
            <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
              <label className="form-label" htmlFor="reg-password">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar-bg">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${passwordStrength.percent}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}

              {/* Password Requirements */}
              <div className="password-requirements">
                <div className={`req-item ${passwordChecks.length ? 'req-pass' : ''}`}>
                  {passwordChecks.length ? checkIcon : <span className="req-dot" />}
                  <span>At least 6 characters</span>
                </div>
                <div className={`req-item ${passwordChecks.uppercase ? 'req-pass' : ''}`}>
                  {passwordChecks.uppercase ? checkIcon : <span className="req-dot" />}
                  <span>One uppercase letter</span>
                </div>
                <div className={`req-item ${passwordChecks.lowercase ? 'req-pass' : ''}`}>
                  {passwordChecks.lowercase ? checkIcon : <span className="req-dot" />}
                  <span>One lowercase letter</span>
                </div>
                <div className={`req-item ${passwordChecks.number ? 'req-pass' : ''}`}>
                  {passwordChecks.number ? checkIcon : <span className="req-dot" />}
                  <span>One number</span>
                </div>
                <div className={`req-item ${passwordChecks.special ? 'req-pass' : ''}`}>
                  {passwordChecks.special ? checkIcon : <span className="req-dot" />}
                  <span>One special character</span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''} ${formData.confirmPassword ? 'filled' : ''}`}>
              <label className="form-label" htmlFor="reg-confirm-password">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${formData.confirmPassword ? (passwordsMatch ? 'input-match' : 'input-mismatch') : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <span className={`match-status ${passwordsMatch ? 'match-pass' : 'match-fail'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}
            </div>

            {/* Terms Agreement */}
            <label className="checkbox-wrapper terms-checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-label">
                I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-btn register-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <svg className="spinner" viewBox="0 0 50 50" width="20" height="20">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="btn-content">
                  <span>Create Account</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="auth-footer">
            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                <span>Sign In</span>
              </Link>
            </p>
            <p className="auth-guest">
              <Link to="/" className="guest-link">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
                </svg>
                Continue as Guest
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
