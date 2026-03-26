import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Target, Lightbulb, Globe } from 'lucide-react';

const About = () => {
  const revealRefs = useRef([]);

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

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const timeline = [
    { year: '2020', title: 'Founded', description: 'InsightBI was born with a mission to democratize AI-powered business analytics.' },
    { year: '2021', title: 'First Module', description: 'Launched Customer Satisfaction module with predictive ML capabilities.' },
    { year: '2022', title: 'Full Suite', description: 'Expanded to four core modules including demand forecasting and billing anomaly detection.' },
    { year: '2023', title: 'Enterprise Scale', description: 'Reached 500+ enterprise clients worldwide with 99% prediction accuracy.' },
    { year: '2024', title: 'Next Generation', description: 'Introducing advanced neural networks and real-time streaming analytics.' },
  ];

  const values = [
    { icon: Award, title: 'Excellence', description: 'We pursue perfection in every algorithm and every interface.' },
    { icon: Target, title: 'Precision', description: 'Data-driven decisions require precise and reliable predictions.' },
    { icon: Lightbulb, title: 'Innovation', description: 'Continuously pushing the boundaries of what AI can achieve.' },
    { icon: Globe, title: 'Impact', description: 'Empowering businesses worldwide to make smarter decisions.' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, rgba(6,6,6,1) 70%)' }} />
        <div ref={addRef} className="reveal-up relative z-[2] text-center max-w-[700px] px-6 py-20">
          <span className="section-tag">Our Heritage</span>
          <h1 className="section-title mb-4">
            The Art of<br /><span className="accent-text">Intelligence</span>
          </h1>
          <p className="section-subtitle">
            Crafting the future of business analytics with the precision of engineering and the elegance of design.
          </p>
        </div>
      </section>

      {/* Story + Blockquote */}
      <section className="py-20 md:py-32 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div ref={addRef} className="reveal-left">
            <span className="section-tag">The Beginning</span>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}>
              Built for the <span className="accent-text">Modern Enterprise</span>
            </h2>
            <p className="text-[0.9rem] leading-[1.8] mb-6" style={{ color: 'var(--text-secondary)' }}>
              InsightBI was founded with a singular vision: to transform raw business data into actionable intelligence. 
              We believe every organization deserves access to the same caliber of predictive analytics that powers 
              Fortune 500 companies.
            </p>
            <p className="text-[0.9rem] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>
              Our four intelligent modules work together to provide a comprehensive view of customer sentiment, 
              market demand, pricing dynamics, and financial integrity — all powered by cutting-edge machine learning.
            </p>
          </div>

          <div ref={addRef} className="reveal-right">
            <blockquote className="relative pl-8 py-4" style={{ borderLeft: '2px solid var(--accent)' }}>
              <p className="text-[clamp(1.3rem,2.5vw,1.8rem)] italic leading-snug mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                "We don't just analyze data — we craft insights with the obsession of artisans and the rigor of scientists."
              </p>
              <footer>
                <cite className="text-[0.85rem] not-italic font-medium" style={{ color: 'var(--accent)' }}>
                  — InsightBI Team
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 px-5 md:px-10 lg:px-[60px]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div ref={addRef} className="reveal-up text-center mb-16 max-w-[700px] mx-auto">
            <span className="section-tag">Our Values</span>
            <h2 className="section-title">Driven by <span className="accent-text">Purpose</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <div key={index} ref={addRef} data-delay={index * 150} className="reveal-up card card-hover p-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ border: '1px solid var(--border-hover)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-[1.4rem] mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="text-[0.85rem]" style={{ color: 'var(--text-secondary)' }}>{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-[900px] mx-auto">
          <div ref={addRef} className="reveal-up text-center mb-16">
            <span className="section-tag">Our Journey</span>
            <h2 className="section-title">Milestones of <span className="accent-text">Innovation</span></h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px]" style={{ background: 'var(--border-subtle)' }} />
            {timeline.map((item, index) => (
              <div key={index} ref={addRef} data-delay={index * 150} className={`reveal-up relative flex flex-col md:flex-row gap-4 md:gap-10 mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full mt-2" style={{ background: 'var(--accent)', boxShadow: '0 0 12px rgba(201,168,76,0.3)' }} />
                <div className={`md:w-1/2 pl-14 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em]" style={{ color: 'var(--accent)' }}>{item.year}</span>
                  <h3 className="text-[1.4rem] mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-[0.85rem]" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 text-center px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div ref={addRef} className="reveal-up max-w-[600px] mx-auto">
          <span className="section-tag">Join Us</span>
          <h2 className="section-title mb-4">
            Ready to <span className="accent-text">Begin?</span>
          </h2>
          <p className="section-subtitle mb-10">
            Discover how InsightBI can transform your business intelligence.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
