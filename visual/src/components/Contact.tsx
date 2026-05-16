import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// For the Vite visual app, put this in visual/.env or visual/.env.local and restart the dev server.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

type ContactValues = {
  name: string;
  email: string;
  message: string;
  botcheck: string;
};

type ContactErrors = {
  name: string;
  email: string;
  message: string;
};

type ContactTouched = {
  name: boolean;
  email: boolean;
  message: boolean;
};

const initialValues: ContactValues = {
  name: '',
  email: '',
  message: '',
  botcheck: '',
};

const initialTouched: ContactTouched = {
  name: false,
  email: false,
  message: false,
};

function SunGlyph({ isLight }: { isLight: boolean }) {
  const stroke = isLight ? '#3a3f44' : '#f2f5f7';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
      <circle cx="12" cy="12" r="3.6" fill="none" stroke={stroke} strokeWidth="2.3" />
      <path
        d="M12 2.8v3.1M12 18.1v3.1M2.8 12h3.1M18.1 12h3.1M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M18.4 5.6l-2.2 2.2M7.8 16.2l-2.2 2.2"
        fill="none"
        stroke={stroke}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonGlyph({ isLight }: { isLight: boolean }) {
  const fill = isLight ? '#3a3f44' : '#d7dbe0';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
      <path
        fill={fill}
        d="M15.66 3.74a8.67 8.67 0 1 0 4.6 15.87a.86.86 0 0 0-.14-1.57a6.96 6.96 0 0 1-5.73-6.86c0-2.48 1.31-4.72 3.43-5.99a.86.86 0 0 0-.3-1.56a8.65 8.65 0 0 0-1.86.11Z"
      />
    </svg>
  );
}

const validateName = (value: string) => {
  if (!value.trim()) return 'Name is required.';
  if (value.trim().length < 2) return 'Name must be at least 2 characters.';
  return '';
};

const validateEmail = (value: string) => {
  if (!value.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address.';
  return '';
};

const validateMessage = (value: string) => {
  if (!value.trim()) return 'Message is required.';
  if (value.trim().length < 10) return 'Message must be at least 10 characters.';
  if (value.length > 1000) return 'Message must be under 1000 characters.';
  return '';
};

export function Contact({ standalone = false }: { standalone?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [touched, setTouched] = useState<ContactTouched>(initialTouched);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const errors = useMemo<ContactErrors>(
    () => ({
      name: validateName(values.name),
      email: validateEmail(values.email),
      message: validateMessage(values.message),
    }),
    [values],
  );

  const isFormValid = useMemo(() => Object.values(errors).every((error) => !error), [errors]);

  const updateField =
    (field: keyof ContactValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = field === 'message' ? event.target.value.slice(0, 1000) : event.target.value;

      setValues((current) => ({
        ...current,
        [field]: nextValue,
      }));

      setTouched((current) => ({
        ...current,
        [field]: true,
      }));

      if (status) {
        setStatus(null);
      }
    };

  const markTouched = (field: keyof ContactTouched) => () => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const inputStateClass = (field: keyof ContactErrors) => {
    const hasValue = values[field].trim().length > 0;
    const showError = touched[field] && errors[field];
    const isValid = touched[field] && !errors[field] && hasValue;

    if (showError) return 'contact-input-error';
    if (isValid) return 'contact-input-success';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      message: true,
    });
    setStatus(null);

    if (!isFormValid || sending) return;

    if (values.botcheck.trim()) {
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      console.error('Missing VITE_WEB3FORMS_ACCESS_KEY. Add it to visual/.env and restart dev server.');
      setStatus({ type: 'error', message: 'Message could not be sent. Please try again.' });
      return;
    }

    setSending(true);

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        subject: `New visual portfolio message from ${values.name.trim()}`,
        from_name: `${values.name.trim()} via Visual Portfolio`,
        replyto: values.email.trim(),
        source: 'Visual Portfolio Contact',
        botcheck: values.botcheck,
      };

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) {
        console.error('Web3Forms submit failed:', result);
        throw new Error(result.message || 'Web3Forms submit failed');
      }

      setValues(initialValues);
      setTouched(initialTouched);
      setStatus({ type: 'success', message: 'Message sent successfully.' });
    } catch (error) {
      console.error('Visual contact submit error:', error);
      setStatus({ type: 'error', message: 'Message could not be sent. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className={`${standalone ? 'contact-section px-5 sm:px-8 lg:pl-[170px] lg:pr-10' : 'section-padding'} relative`}
    >
      {standalone ? (
        <button
          type="button"
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
          onClick={toggleTheme}
          className="fixed right-4 top-12 z-40 flex h-14 w-14 items-center justify-center rounded-2xl border border-transparent bg-transparent shadow-none backdrop-blur-0 transition-none sm:right-6 sm:top-16"
        >
          {isLight ? <MoonGlyph isLight={isLight} /> : <SunGlyph isLight={isLight} />}
        </button>
      ) : null}

      <div className={`mx-auto ${standalone ? 'max-w-[540px] w-full' : 'max-w-[800px]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className={`${standalone ? 'contact-card' : 'space-y-8'}`}
        >
          <div className={`${standalone ? 'space-y-0' : ''}`}>
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-accent-gold">Contact</p>
              <h2 className="text-[1.55rem] font-bold tracking-tight text-text-primary sm:text-[1.85rem] md:text-[2.05rem]">
                Send a message
              </h2>
              <p className="max-w-[42rem] text-[12px] leading-[1.35] text-text-secondary sm:text-[13px]">
                Have a project, opportunity, or data idea? Write it here.
              </p>
              <div className="contact-divider" aria-hidden="true" />
            </div>

            <form noValidate onSubmit={handleSubmit} className="visual-contact-page-form">
              <input
                type="text"
                name="botcheck"
                value={values.botcheck}
                onChange={updateField('botcheck')}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <label htmlFor="contact-name" className="visual-contact-label">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  value={values.name}
                  onChange={updateField('name')}
                  onBlur={markTouched('name')}
                  placeholder="Your name"
                  className={`contact-input ${inputStateClass('name')}`}
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby="contact-name-error"
                />
                <p id="contact-name-error" className="visual-contact-page-error">
                  {touched.name ? errors.name : ''}
                </p>
              </div>

              <div>
                <label htmlFor="contact-email" className="visual-contact-label">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={updateField('email')}
                  onBlur={markTouched('email')}
                  placeholder="Your email"
                  className={`contact-input ${inputStateClass('email')}`}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby="contact-email-error"
                />
                <p id="contact-email-error" className="visual-contact-page-error">
                  {touched.email ? errors.email : ''}
                </p>
              </div>

              <div>
                <div className="mb-[6px] flex items-center gap-3">
                  <label htmlFor="contact-message" className="visual-contact-label">
                    Message
                  </label>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  value={values.message}
                  onChange={updateField('message')}
                  onBlur={markTouched('message')}
                  placeholder="Write your message"
                  className={`contact-textarea ${inputStateClass('message')}`}
                  aria-invalid={Boolean(touched.message && errors.message)}
                  aria-describedby="contact-message-error"
                />
                <p id="contact-message-error" className="visual-contact-page-error">
                  {touched.message ? errors.message : ''}
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <button type="submit" disabled={!isFormValid || sending} className="contact-submit">
                  <Send size={18} />
                  <span>{sending ? 'Sending...' : 'Send message'}</span>
                </button>

                {status ? (
                  <p
                    className={`text-sm font-semibold ${
                      status.type === 'success' ? 'text-[#25D366]' : 'text-[#ff6b6b]'
                    }`}
                    role="status"
                  >
                    {status.message}
                  </p>
                ) : null}
              </div>
            </form>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
