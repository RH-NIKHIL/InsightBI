import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileWarning,
  Zap,
  Shield,
  Clock,
  LineChart,
  CheckCircle2,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const revealRefs = useRef([]);
  const counterRefs = useRef([]);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Counter animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target || '0', 10);
            const suffix = el.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();
            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
            const update = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.floor(easeOutQuart(progress) * target);
              el.textContent = current.toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(update);
              else el.textContent = target.toLocaleString() + suffix;
            };
            requestAnimationFrame(update);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const addCounterRef = (el) => {
    if (el && !counterRefs.current.includes(el)) counterRefs.current.push(el);
  };

  const features = [
    {
      icon: Users,
      title: 'Customer Satisfaction',
      description: 'Predict satisfaction levels using advanced ML to enhance customer experience.',
      path: '/customer-satisfaction',
      badge: 'ML-Powered',
    },
    {
      icon: TrendingUp,
      title: 'Demand Forecasting',
      description: 'Accurate demand prediction using historical data and market trends.',
      path: '/demand-forecast',
      badge: 'Predictive',
    },
    {
      icon: DollarSign,
      title: 'Price Volatility',
      description: 'Analyze and predict price fluctuations for robust pricing strategies.',
      path: '/price-volatility',
      badge: 'Analytics',
    },
    {
      icon: FileWarning,
      title: 'Billing Anomaly',
      description: 'Detect unusual billing patterns and prevent revenue leakage.',
      path: '/billing-anomaly',
      badge: 'Detection',
    },
  ];

  const stats = [
    { value: 99, suffix: '%', label: 'Prediction Accuracy' },
    { value: 500, suffix: '+', label: 'Enterprise Clients' },
    { value: 50, suffix: 'M+', label: 'Predictions Made' },
    { value: 24, suffix: '/7', label: 'Support Available' },
  ];

  const benefits = [
    { icon: Zap, title: 'Real-time Analysis', description: 'Process and analyze data in real-time for immediate insights' },
    { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security with 99.9% uptime guarantee' },
    { icon: Clock, title: 'Save Time', description: 'Automate complex analytics tasks and focus on strategy' },
    { icon: LineChart, title: 'Accurate Predictions', description: 'ML-powered predictions with industry-leading accuracy' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative w-full min-h-[700px] h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, rgba(6,6,6,1) 70%)' }} />

        {/* Content */}
        <div className="relative z-[2] text-center max-w-[900px] px-6">
          <div
            ref={addRevealRef}
            className="reveal-up inline-block text-[0.65rem] font-medium tracking-[0.5em] uppercase mb-8 py-2 px-6"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--accent)',
              border: '1px solid var(--border-hover)',
            }}
          >
            AI-POWERED ANALYTICS
          </div>

          <h1
            ref={addRevealRef}
            className="reveal-up"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            <span className="block" style={{ color: 'var(--text-primary)' }}>Transform Data Into</span>
            <span className="block gradient-text">Strategic Decisions</span>
          </h1>

          <p
            ref={addRevealRef}
            className="reveal-up mx-auto mb-10"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
              fontWeight: 300,
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              lineHeight: 1.8,
            }}
          >
            InsightBI integrates four intelligent modules to enhance strategic and operational 
            efficiency through predictive analytics and AI.
          </p>

          <div ref={addRevealRef} className="reveal-up flex gap-5 justify-center flex-wrap">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[2]">
          <div className="scroll-line" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
            Scroll to Discover
          </span>
        </div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div
        className="py-10 overflow-hidden"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div className="marquee-track">
          {['SATISFACTION', '◆', 'FORECAST', '◆', 'VOLATILITY', '◆', 'ANOMALY', '◆', 'INTELLIGENCE', '◆', 'ANALYTICS', '◆',
            'SATISFACTION', '◆', 'FORECAST', '◆', 'VOLATILITY', '◆', 'ANOMALY', '◆', 'INTELLIGENCE', '◆', 'ANALYTICS', '◆',
          ].map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: text === '◆' ? '0.8rem' : 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 300,
                letterSpacing: '0.2em',
                color: text === '◆' ? 'var(--accent)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                opacity: text === '◆' ? 0.6 : 0.4,
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════ FEATURES / MODELS ═══════════════════ */}
      <section className="py-20 md:py-32 px-5 md:px-10 lg:px-[60px]" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div ref={addRevealRef} className="reveal-up text-center max-w-[700px] mx-auto mb-16 md:mb-20">
            <span className="section-tag">The Collection</span>
            <h2 className="section-title">
              Intelligent Modules of<br />
              <span className="accent-text">Engineering Art</span>
            </h2>
            <p className="section-subtitle">
              Four powerful AI-driven modules designed to address key business challenges with precision and insight.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.path}
                  ref={addRevealRef}
                  data-delay={index * 150}
                  className="reveal-up card card-hover overflow-hidden group"
                >
                  {/* Image area */}
                  <div className="relative h-48 overflow-hidden" style={{ background: 'var(--surface)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-16 h-16 transition-transform duration-700 group-hover:scale-110" style={{ color: 'var(--accent)', opacity: 0.3 }} />
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
                    />
                    <span
                      className="absolute top-4 right-4 text-[0.6rem] font-semibold tracking-[0.15em] uppercase py-1 px-3"
                      style={{ background: 'var(--accent)', color: 'var(--bg-primary)', borderRadius: '2px' }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3
                      className="text-[1.5rem] mb-1"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-[0.8rem] italic mb-5" style={{ color: 'var(--text-muted)' }}>
                      {feature.description}
                    </p>
                    <span className="btn-outline text-[0.6rem]">Discover</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS / ENGINEERING ═══════════════════ */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="carbon-pattern w-full h-full" />
        </div>
        <div className="relative z-[1] max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px]">
          <div ref={addRevealRef} className="reveal-up text-center max-w-[700px] mx-auto mb-16">
            <span className="section-tag">Precision Intelligence</span>
            <h2 className="section-title">
              Where Data Meets <span className="accent-text">Obsession</span>
            </h2>
            <p className="section-subtitle">
              Every prediction is crafted with the precision of advanced algorithms and the passion of innovation.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16 md:mb-24">
            {stats.map((stat, index) => (
              <div
                key={index}
                ref={addRevealRef}
                data-delay={index * 150}
                className="reveal-up glass text-center rounded-xl p-8 md:p-10 transition-all duration-600 hover:-translate-y-1.5"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <div className="text-2xl mb-4">
                  {['⚡', '🏢', '🎯', '🛡️'][index]}
                </div>
                <span
                  ref={addCounterRef}
                  data-target={stat.value}
                  data-suffix={stat.suffix}
                  className="block mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    lineHeight: 1,
                  }}
                >
                  0
                </span>
                <span className="text-[0.7rem] tracking-[0.15em] uppercase" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Engineering Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  ref={addRevealRef}
                  className="reveal-up glass rounded-xl p-8 transition-all duration-600 hover:-translate-y-1 hover:border-[var(--border-hover)]"
                >
                  <div className="w-12 h-12 mb-5" style={{ color: 'var(--accent)' }}>
                    <Icon className="w-full h-full" strokeWidth={1.5} />
                  </div>
                  <h4
                    className="text-[1.3rem] mb-3"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                  >
                    {benefit.title}
                  </h4>
                  <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}

            {/* Extra feature card */}
            <div
              ref={addRevealRef}
              className="reveal-up glass rounded-xl p-8 transition-all duration-600 hover:-translate-y-1 hover:border-[var(--border-hover)]"
            >
              <div className="w-12 h-12 mb-5" style={{ color: 'var(--accent)' }}>
                <CheckCircle2 className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h4
                className="text-[1.3rem] mb-3"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                Scalable Architecture
              </h4>
              <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Built to grow with your business — from startup to enterprise scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative min-h-[500px] h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, rgba(6,6,6,1) 70%)' }} />
        <div ref={addRevealRef} className="reveal-up relative z-[2] text-center max-w-[700px] px-6">
          <span className="section-tag">Start Your Journey</span>
          <h2
            className="mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
            }}
          >
            Ready to Transform<br />
            <span className="accent-text">Your Business?</span>
          </h2>
          <p className="mb-9" style={{
            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
            color: 'var(--text-secondary)',
            fontWeight: 300,
            lineHeight: 1.8,
          }}>
            Start leveraging AI-powered insights today and make data-driven decisions that drive growth.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-[0.78rem] py-4 px-12">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-primary text-[0.78rem] py-4 px-12">
              Sign In
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
