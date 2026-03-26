import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Customer Satisfaction', path: '/customer-satisfaction' },
      { name: 'Demand Forecast', path: '/demand-forecast' },
      { name: 'Price Volatility', path: '/price-volatility' },
      { name: 'Billing Anomaly', path: '/billing-anomaly' },
    ],
    company: [
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '#' },
      { name: 'Press', path: '#' },
    ],
    resources: [
      { name: 'Documentation', path: '#' },
      { name: 'API Reference', path: '#' },
      { name: 'Support', path: '#' },
      { name: 'Status', path: '#' },
    ],
  };

  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '80px' }}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px]">
        {/* Top Section */}
        <div
          className="flex flex-col md:flex-row justify-between gap-10 md:gap-16 pb-16"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="flex flex-col items-start gap-[2px] mb-4">
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
            <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              AI-powered predictive analytics<br />
              redefining business intelligence.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-10 md:gap-16 lg:gap-20">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4
                  className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase mb-4"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--accent)' }}
                >
                  {category}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-[0.85rem] transition-colors duration-300 hover:text-[var(--accent)]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="text-center py-12" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h4
            className="text-[1.5rem] mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Stay in the Loop
          </h4>
          <p className="text-[0.85rem] mb-6" style={{ color: 'var(--text-secondary)' }}>
            Receive updates on new features and insights.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="input-field flex-1"
              aria-label="Email"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-[0.75rem]" style={{ color: 'var(--text-muted)' }}>
            © {currentYear} InsightBI. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Instagram', 'Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                aria-label={social}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="text-xs font-medium">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
