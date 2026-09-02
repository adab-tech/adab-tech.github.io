'use client';

import { useState } from 'react';

// Set after deploying cf-worker/ (see cf-worker/README.md) — wrangler prints
// this on first deploy. Left blank until then, in which case the form falls
// back to a mailto: link instead of failing silently.
const RELAY_URL = '';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openMailto = () => {
    const subject = encodeURIComponent(`New message from ${formData.name} via adamu.tech`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name} (${formData.email})`);
    window.location.href = `mailto:contact@adamu.tech?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!RELAY_URL) {
      // No backend deployed yet — open the visitor's own email client
      // pre-addressed to contact@adamu.tech instead of faking a submission.
      openMailto();
      setFormData({ name: '', email: '', message: '' });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(RELAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Relay responded ${res.status}`);
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact relay failed, falling back to mailto:', err);
      setStatus('error');
      openMailto();
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Let's Build Together</h2>
        </div>
        
        <div className="contact-content">
          <div className="contact-info" data-animate="fade-right">
            <h3>Contact Information</h3>
            <p>
              Have a project in mind or want to collaborate? Feel free to reach out. 
              I'm always open to discussing new ideas and opportunities.
            </p>
            
            <div className="info-item">
              <a href="mailto:adamudanjuma1@outlook.com" aria-label="Email Adamu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>
          
          <form className="contact-form" data-animate="fade-left" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
            {status === 'sent' && <p role="status">Message sent — thank you!</p>}
            {status === 'error' && (
              <p role="status">
                Couldn&apos;t send that automatically, so your email client should have opened instead.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
