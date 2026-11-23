'use client';

import { useState, useSyncExternalStore } from 'react';
import { Copy } from 'lucide-react';
import { CONTACT } from '@/lib/contact-content';

// Set after deploying cf-worker/ (see cf-worker/README.md) — wrangler prints
// this on first deploy. Left blank until then, in which case the form falls
// back to a mailto: link instead of failing silently.
const RELAY_URL = '';

const fieldClass = 'w-full rounded-lg border border-zinc-600 bg-[#0B1120] px-3 py-2.5 text-base text-zinc-100 focus:border-gold-500 focus:outline-2 focus:outline-gold-500';

// The mail link works immediately. Enhanced controls wait for their event handlers.
const subscribe = () => () => {};
const ContactPage = () => {
  const interactive = useSyncExternalStore(subscribe, () => true, () => false);
  const [copyResult, setCopyResult] = useState<'copied' | 'manual' | null>(null);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopyResult('copied');
    } catch {
      setCopyResult('manual');
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const draftUrl = () => {
    const subject = encodeURIComponent(CONTACT.emailSubject.replace(/\{name\}/g, () => formData.name));
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name} (${formData.email})`);
    return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!RELAY_URL) {
      // A missing or blocked protocol handler must not navigate away from the form.
      window.open(draftUrl(), '_blank', 'noopener,noreferrer');
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
      console.error('Contact relay failed:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-2">
        <p className="text-sm font-mono font-semibold text-gold-500">{CONTACT.label}</p>
        <h1 className="text-3xl font-mono font-bold text-zinc-50 sm:text-5xl">{CONTACT.heading}</h1>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <h2 className="text-xl font-semibold text-zinc-100">{CONTACT.infoHeading}</h2>
          <p className="max-w-prose leading-relaxed text-zinc-300">{CONTACT.intro}</p>
          <a href={`mailto:${CONTACT.email}`} aria-label={`${CONTACT.emailLinkLabel} (${CONTACT.email})`}
            className="inline-flex min-h-11 max-w-full items-center break-all text-gold-500 underline underline-offset-4">
            {CONTACT.email}
          </a>
          <div>
            <button type="button" disabled={!interactive} onClick={copyEmail} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-600 px-3 text-sm text-zinc-100 hover:border-gold-500">
              <Copy className="h-4 w-4" aria-hidden="true" />{CONTACT.copyLabel}
            </button>
            <p role="status" className="mt-2 text-sm text-zinc-300">
              {copyResult === 'copied' && CONTACT.copiedMessage}
              {copyResult === 'manual' && CONTACT.copyHelp}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} method="post" inert={!interactive}
          className="min-w-0 space-y-4 rounded-2xl border border-zinc-800 bg-[#0E1526] p-4 sm:p-6">
          <div className="space-y-1">
            <label htmlFor="name">{CONTACT.nameLabel}</label>
            <input type="text" id="name" name="name" autoComplete="name" className={fieldClass} value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <label htmlFor="email">{CONTACT.emailLabel}</label>
            <input type="email" id="email" name="email" autoComplete="email" className={fieldClass} value={formData.email} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <label htmlFor="message">{CONTACT.messageLabel}</label>
            <textarea id="message" name="message" rows={5} className={fieldClass} value={formData.message} onChange={handleChange} required />
          </div>
          {!RELAY_URL && <p id="email-app-hint" className="text-sm leading-relaxed text-zinc-300">{CONTACT.emailAppHint}</p>}
          <button type="submit" disabled={!interactive || status === 'sending'} aria-describedby={RELAY_URL ? undefined : 'email-app-hint'}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gold-500 px-4 py-2 text-base font-semibold text-zinc-950 hover:bg-gold-400">
            {RELAY_URL ? (status === 'sending' ? CONTACT.sendingLabel : CONTACT.sendLabel) : CONTACT.emailAppLabel}
          </button>
          {status === 'sent' && <p role="status">{CONTACT.successMessage}</p>}
          {status === 'error' && (
            <div className="space-y-1">
              <p role="status">{CONTACT.fallbackMessage}</p>
              <a href={draftUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-gold-500 underline">
                {CONTACT.emailAppLabel}
              </a>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
