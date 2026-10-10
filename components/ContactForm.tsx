'use client';

import { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!WEB3FORMS_KEY) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_KEY);
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      setStatus(res.ok ? 'ok' : 'error');
      if (res.ok) form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return <p className="rounded-[16px] border border-line bg-sand p-5 text-[16px] text-ink">Thanks, your message is on its way. We’ll reply to the email you gave.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Field id="name" name="name" label="Your name" required placeholder="Jane Doe" inputMode="text" />
      <Field id="email" name="email" type="email" label="Your email" required placeholder="you@example.com" inputMode="email" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-[14px] font-medium text-ink">Message</label>
        <textarea id="message" name="message" required rows={5}
          className="rounded-[12px] border border-field bg-white p-3 text-[16px] text-ink focus:border-brand focus:shadow-[0_0_0_4px_rgba(31,92,69,0.15)] focus:outline-none" />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="brand" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
        {status === 'error' && (
          <span className="text-[14px] text-danger">
            {WEB3FORMS_KEY ? 'Something went wrong. Email hello@pawscales.com instead.' : 'Form not configured yet. Email hello@pawscales.com.'}
          </span>
        )}
      </div>
    </form>
  );
}
