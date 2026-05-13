import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const isValid = useMemo(() => {
    return name.trim().length > 0 && /\S+@\S+\.\S+/.test(email.trim()) && message.trim().length > 0 && !sending;
  }, [name, email, message, sending]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    setSending(true);
    setStatusText(null);
    setStatusType(null);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    formData.append('message', message.trim());
    formData.append('_subject', 'New message from Visual Portfolio');
    formData.append('_template', 'table');
    formData.append('_captcha', 'true');
    formData.append('_honey', '');

    try {
      const response = await fetch('https://formsubmit.co/ajax/apondas007890@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!response.ok) throw new Error('FormSubmit request failed');

      setStatusType('success');
      setStatusText("Message sent successfully. I'll reply soon.");
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatusType('error');
      setStatusText('Message failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section-padding min-h-screen">
      <div className="mx-auto max-w-[1240px] pb-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-[760px] lg:ml-[12%]"
        >
          <h2 className="text-5xl font-bold tracking-tight text-text-primary md:text-6xl">Let&apos;s Connect</h2>
          <p className="mt-5 max-w-[680px] text-base leading-relaxed text-[rgba(245,245,245,0.65)] md:text-lg">
            Have a question, feedback, or opportunity? Send a message here, and I&apos;ll do my best to reply.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-12">
            <div className="space-y-3">
              <label htmlFor="fullName" className="text-sm font-semibold text-text-primary">
                Full name
              </label>
              <input
                id="fullName"
                name="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full border-0 border-b border-white/18 bg-transparent px-0 pb-3 text-lg text-text-primary placeholder:text-text-muted/70 focus:border-[#00eeff] focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-semibold text-text-primary">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full border-0 border-b border-white/18 bg-transparent px-0 pb-3 text-lg text-text-primary placeholder:text-text-muted/70 focus:border-[#00eeff] focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-semibold text-text-primary">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
                className="w-full resize-y border-0 border-b border-white/18 bg-transparent px-0 pb-3 text-lg text-text-primary placeholder:text-text-muted/70 focus:border-[#00eeff] focus:outline-none focus:ring-0"
              />
            </div>

            <input type="hidden" name="_honey" value="" />
            <input type="hidden" name="_subject" value="New message from Visual Portfolio" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="true" />

            <button
              type="submit"
              disabled={!isValid}
              className="inline-flex items-center gap-3 bg-[#00eeff] px-8 py-4 text-2xl font-bold text-[#0a0e0f] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d6be73] disabled:cursor-not-allowed disabled:opacity-55"
              style={{ clipPath: 'polygon(0 0, 100% 0, 94% 100%, 0% 100%)' }}
            >
              <Send size={20} />
              <span>{sending ? 'Sending...' : 'Send message'}</span>
            </button>

            {statusText ? (
              <p className={statusType === 'success' ? 'text-sm font-semibold text-[#00eeff]' : 'text-sm font-semibold text-red-400'}>
                {statusText}
              </p>
            ) : null}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="py-4">
      <div className="mx-auto flex max-w-[1240px] items-center justify-center px-6 text-center">
        <div id="resume" className="relative -top-24 h-0 w-0" aria-hidden="true" />
        <p className="text-[16px] font-semibold tracking-[0.04em] text-text-muted">
          © {new Date().getFullYear()} AP. All rights reserved
        </p>
      </div>
    </footer>
  );
};

