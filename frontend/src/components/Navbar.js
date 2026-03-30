import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  BarChart3,
  LogOut,
  User,
  ChevronDown,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const protectedNavLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Forecast', path: '/demand-forecast' },
    { name: 'Volatility', path: '/price-volatility' },
    { name: 'Anomaly', path: '/billing-anomaly' },
  ];

  const navLinks = isAuthenticated ? protectedNavLinks : publicNavLinks;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600`}
      style={{
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(6, 6, 6, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(30px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(30px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start gap-[2px] -ml-1">
          <span
            className="text-[1.6rem] font-normal tracking-[0.6em]"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
          >
            INSIGHT
          </span>
          <span
            className="text-[0.55rem] tracking-[0.5em] uppercase"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
          >
            BUSINESS INTELLIGENCE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="relative py-1.5 text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300 group whitespace-nowrap"
                style={{ 
                  color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {link.name}
                <span
                  className="absolute bottom-0 left-0 h-[1px] transition-all duration-600 ease-out"
                  style={{
                    width: isActive(link.path) ? '100%' : '0%',
                    background: 'var(--accent)',
                  }}
                />
                <style>{`
                  .group:hover span { width: 100% !important; }
                `}</style>
              </Link>
            </li>
          ))}
          {isAuthenticated ? (
            <li>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 py-1.5 transition-colors duration-300"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}
                  >
                    <User className="w-4 h-4" style={{ color: 'var(--bg-primary)' }} />
                  </div>
                  <span className="text-[0.75rem] tracking-[0.1em] uppercase" style={{ color: 'var(--text-primary)' }}>
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-lg py-2 animate-fade-in"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm w-full transition-colors duration-200"
                      style={{ color: '#ef4444' }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="text-[0.75rem] font-normal tracking-[0.15em] uppercase py-2 px-5 transition-all duration-300"
                style={{
                  color: 'var(--accent)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: '2px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--accent)';
                  e.target.style.color = 'var(--bg-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--accent)';
                }}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-1 z-[1001]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none' }}
        >
          {isOpen ? (
            <X className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
          ) : (
            <>
              <span className="block w-7 h-[1px]" style={{ background: 'var(--text-primary)' }} />
              <span className="block w-7 h-[1px]" style={{ background: 'var(--text-primary)' }} />
              <span className="block w-7 h-[1px]" style={{ background: 'var(--text-primary)' }} />
            </>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-10 animate-fade-in"
          style={{
            background: 'rgba(6,6,6,0.97)',
            backdropFilter: 'blur(40px)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-[1.2rem] tracking-[0.3em] uppercase transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="text-[0.85rem] tracking-[0.2em] uppercase"
                style={{ color: '#ef4444', background: 'none', border: 'none' }}
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-[0.85rem] tracking-[0.2em] uppercase py-3 px-8"
                style={{
                  color: 'var(--accent)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: '2px',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
