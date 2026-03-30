import React, { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { const d = parseInt(entry.target.dataset.delay || '0', 10); setTimeout(() => entry.target.classList.add('visible'), d); observer.unobserve(entry.target); } }); },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'hello@insightbi.com', link: 'mailto:hello@insightbi.com' },
    { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567', link: 'tel:+15551234567' },
    { icon: MapPin, title: 'Location', value: 'San Francisco, CA', link: '#' },
    { icon: Clock, title: 'Hours', value: 'Mon-Fri, 9AM-5PM PST', link: '#' },
  ];

  const labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-secondary)' };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, rgba(6,6,6,1) 70%)' }} />
        <div ref={addRef} className="reveal-up relative z-[2] text-center max-w-[700px] px-6 py-16">
          <span className="section-tag">Get In Touch</span>
          <h1 className="section-title mb-4">Let's <span className="accent-text">Connect</span></h1>
          <p className="section-subtitle">Have a question or ready to transform your analytics? We'd love to hear from you.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-32 px-5 md:px-10 lg:px-[60px]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Contact Info */}
          <div className="md:col-span-2">
            <div ref={addRef} className="reveal-left">
              <span className="section-tag">Contact</span>
              <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}>
                Reach <span className="accent-text">Out</span>
              </h2>
              <p className="text-[0.9rem] leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
                Our team is ready to assist you with any inquiries about InsightBI's capabilities.
              </p>
            </div>
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a key={index} ref={addRef} data-delay={index * 100} href={item.link} className="reveal-left flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:border-[var(--accent)]" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>{item.title}</p>
                      <p className="text-[0.9rem]" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3" ref={addRef}>
            <div className="reveal-right card p-8 md:p-10">
              {submitted && (
                <div className="mb-6 p-4 rounded-lg text-center" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <p className="text-sm" style={{ color: '#4ade80' }}>Thank you! We'll be in touch shortly.</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" style={labelStyle}>Name</label>
                    <input id="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Email</label>
                    <input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="input-field" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" style={labelStyle}>Subject</label>
                  <input id="subject" type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required className="input-field" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="message" style={labelStyle}>Message</label>
                  <textarea id="message" rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="input-field resize-none" placeholder="Your message..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid var(--bg-primary)', borderTopColor: 'transparent' }} /><span>Sending...</span></>
                  ) : (
                    <><span>Send Message</span><Send className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
