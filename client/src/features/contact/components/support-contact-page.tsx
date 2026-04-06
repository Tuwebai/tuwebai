import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useContactSubmission } from '@/features/contact/hooks/use-contact-submission';
import { getContactErrorMessage } from '@/features/contact/services/contact.service';
import { Input } from '@/shared/ui/input';
import MetaTags from '@/shared/ui/meta-tags';
import { Textarea } from '@/shared/ui/textarea';

export default function SupportContactPage() {
  const { submitContactForm } = useContactSubmission();
  const [form, setForm] = useState({ name: '', email: '', title: '', message: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    const snapshot = { ...form };
    setSubmitState('submitting');

    void submitContactForm(snapshot)
      .then(() => {
        setSubmitState('sent');
        setAlert({ type: 'success', message: 'Mensaje recibido. Lo estamos procesando.' });
        setForm({ name: '', email: '', title: '', message: '' });

        setTimeout(() => {
          setAlert(null);
          setSubmitState('idle');
        }, 4000);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: getContactErrorMessage(err, 'No se pudo enviar el mensaje. Intenta de nuevo.'),
        });
        setForm(snapshot);
        setSubmitState('idle');
      });
  };

  return (
    <>
      <MetaTags
        title="Contacto"
        description="Consulta gratuita sin compromiso. Contanos qué necesita tu negocio y te respondemos en menos de 24 horas. Río Tercero, Córdoba. Atención lunes a sábado."
        keywords="contacto TuWebAI, consulta gratuita, proyecto web, Río Tercero, Córdoba"
        url="https://tuweb-ai.com/contacto"
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />
      <div className="page-shell-surface flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-[var(--border-default)] bg-[var(--bg-overlay)] p-8 shadow-[var(--shadow-elevated)]">
          <h1 className="mb-2 font-rajdhani text-3xl font-bold text-[var(--signal)]">
            Contacto de Soporte
          </h1>
          <p className="mb-6 text-center text-gray-400">
            ¿Tenés dudas, problemas o necesitás ayuda? Completá el formulario y nuestro equipo de soporte te responderá a la brevedad.
          </p>
          <p className="mb-6 text-center text-sm text-gray-400">
            Si querés revisar qué falla en tu web antes de escribirnos,{' '}
            <Link to="/diagnostico-gratuito" className="text-[var(--signal)] underline underline-offset-4">
              Pedí tu diagnóstico gratuito →
            </Link>
          </p>

          {alert ? (
            <div
              className={`mb-4 w-full rounded px-4 py-3 text-center font-semibold ${
                alert.type === 'success'
                  ? 'border border-emerald-500/30 bg-[var(--success-dim)] text-emerald-300'
                  : 'border border-red-500/30 bg-[var(--danger-dim)] text-red-300'
              }`}
            >
              {alert.message}
            </div>
          ) : null}

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-1 block font-medium text-white">
                Nombre completo
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="border-[var(--border-default)] bg-[var(--bg-elevated)] text-white"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block font-medium text-white">
                Correo electrónico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="border-[var(--border-default)] bg-[var(--bg-elevated)] text-white"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="title" className="mb-1 block font-medium text-white">
                Asunto
              </label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="border-[var(--border-default)] bg-[var(--bg-elevated)] text-white"
                placeholder="Motivo del contacto"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block font-medium text-white">
                Mensaje
              </label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className="border-[var(--border-default)] bg-[var(--bg-elevated)] text-white"
                placeholder="Contanos en qué podemos ayudarte"
                rows={5}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-[image:var(--gradient-brand)] px-4 py-3 text-lg font-semibold text-white shadow-[var(--glow-signal)] transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitState === 'submitting'}
            >
              {submitState === 'submitting' ? 'Enviando...' : submitState === 'sent' ? 'Enviado' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
